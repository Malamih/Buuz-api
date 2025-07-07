import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Portoflio } from './schemas/portfolio';
import mongoose from 'mongoose';
import { CreatePortfolioDto } from './dtos/create-portfolio';
import { updatePortfolioDto } from './dtos/update-portfolio.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { filter } from 'rxjs';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectModel(Portoflio.name)
    readonly portoflioModel: mongoose.Model<Portoflio>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(
    filters: Record<string, any> = {},
  ): Promise<{ payload: any[]; message: string }> {
    const matchStage =
      Object.keys(filters).length > 0 ? [{ $match: filters }] : [];
    const portfolios = await this.portoflioModel.aggregate([
      ...matchStage,
      {
        $lookup: {
          from: 'projects',
          localField: 'projects',
          foreignField: '_id',
          as: 'projects',
          pipeline: [
            {
              $project: {
                _id: 1,
                type: 1,
                title: 1,
                thumbnail: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          projects_count: { $size: '$projects' },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return {
      message: 'Portfolios have been fetched successfully',
      payload: portfolios,
    };
  }

  async findAllByFields(
    fields?: string[],
  ): Promise<{ payload: Portoflio[]; message: string }> {
    const portfolios = await this.portoflioModel
      .find()
      .select((fields ? fields.join(',') : '') || '')
      .sort({ createdAt: -1 })
      .exec();
    return {
      message: 'Portfolios have been fetched successfully',
      payload: portfolios,
    };
  }

  async findOne(id: string): Promise<{ message: string; payload: Portoflio }> {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error('Invalid client ID');
    }

    const portfolios = await this.portoflioModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projects',
          foreignField: '_id',
          as: 'projects',
          pipeline: [
            {
              $project: {
                _id: 1,
                type: 1,
                title: 1,
                thumbnail: 1,
                // يمكنك إضافة المزيد من الحقول إذا كنت تحتاجها
              },
            },
          ],
        },
      },
      {
        $addFields: {
          projects_count: { $size: '$projects' },
        },
      },
    ]);

    if (!portfolios || portfolios.length === 0) {
      throw new Error('Client is not found');
    }

    return {
      message: 'Client has been found',
      payload: portfolios[0],
    };
  }

  async create(
    data: CreatePortfolioDto,
    image: Express.Multer.File,
    logo: Express.Multer.File,
  ): Promise<{ message: string; payload: Portoflio } | undefined> {
    try {
      const portfolioExists = await this.portoflioModel.findOne({
        name: data?.name,
      });
      if (portfolioExists) {
        throw new BadRequestException(
          'Portfolio already exists. Please change the name and try again.',
        );
      }
      const { public_id, secure_url } =
        await this.cloudinaryService.uploadImage(image, 'clients_backgrounds');
      const { public_id: logo_public_id, secure_url: logo_secure_url } =
        await this.cloudinaryService.uploadImage(logo, 'logos');
      const portfolio = await this.portoflioModel.create({
        ...data,
        image: secure_url,
        image_public_id: public_id,
        logo: logo_secure_url,
        logo_public_id: logo_public_id,
      });
      return { message: 'Portfolio have been created', payload: portfolio };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: string,
    data: updatePortfolioDto,
    image?: Express.Multer.File,
    logo?: Express.Multer.File,
  ): Promise<{ message: string; payload: Portoflio } | undefined> {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('Invalid client ID');
      }
      const existingPortfolio = await this.portoflioModel.findById(id);
      if (!existingPortfolio)
        throw new NotFoundException('Client is not found');
      let secure_url: null | string = null;
      let public_id: null | string = null;

      let logo_secure_url: null | string = null;
      let logo_public_id: null | string = null;

      if (logo) {
        await this.cloudinaryService.deleteImage(
          existingPortfolio.logo_public_id,
        );
        const uploadResult = await this.cloudinaryService.uploadImage(
          logo,
          'logos',
        );
        logo_secure_url = uploadResult.secure_url;
        logo_public_id = uploadResult.public_id;
      }

      if (image) {
        await this.cloudinaryService.deleteImage(
          existingPortfolio.image_public_id,
        );
        const uploadResult = await this.cloudinaryService.uploadImage(
          image,
          'clients_backgrounds',
        );
        secure_url = uploadResult.secure_url;
        public_id = uploadResult.public_id;
      }
      const portfolio = await this.portoflioModel.findByIdAndUpdate(
        id,
        {
          $set: {
            ...data,
            ...(public_id && secure_url
              ? { image: secure_url, image_public_id: public_id }
              : {}),
            ...(logo_public_id && logo_secure_url
              ? { logo: logo_secure_url, logo_public_id: logo_public_id }
              : {}),
          },
        },
        { new: true },
      );

      if (!portfolio) {
        throw new Error('Client is not found');
      }

      return { message: 'Client have been updated', payload: portfolio };
    } catch (error) {
      throw new Error('Error updating Client: ' + error.message);
    }
  }

  async delete(id: string): Promise<{ message: string; payload: Portoflio }> {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error('Invalid client ID');
    }
    const existingPortfolio = await this.portoflioModel.findById(id);
    if (!existingPortfolio) throw new NotFoundException('Client is not found');
    if (existingPortfolio.image_public_id) {
      await this.cloudinaryService.deleteImage(
        existingPortfolio.image_public_id,
      );
    }
    if (existingPortfolio.logo_public_id) {
      await this.cloudinaryService.deleteImage(
        existingPortfolio.logo_public_id,
      );
    }
    const portfolio = await this.portoflioModel.findByIdAndDelete(id, {
      new: true,
    });
    if (!portfolio) {
      throw new Error('Client is not found');
    }
    return { message: 'Client have been deleted', payload: portfolio };
  }

  async deleteAll(): Promise<{ message: string }> {
    await this.portoflioModel.deleteMany();
    return { message: 'All portfolios have been deleted' };
  }
}
