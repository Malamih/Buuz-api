import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId, ObjectId } from 'mongoose';
import { page } from './schemas/page.schema';
import { UpdatePageDto } from './dtos/update-page.dto';

export interface findAllRes {
  message: string;
  payload: page[];
  totalCount: number;
  count: number;
}

export interface createRes {
  message: string;
  payload: page;
}

@Injectable()
export class PageService {
  constructor(
    @InjectModel(page.name)
    private readonly pageModel: mongoose.Model<page>,
  ) {}

  async findAll(filters: {}): Promise<findAllRes> {
    const [data, total] = await Promise.all([
      this.pageModel
        .find(filters)
        .populate('projects')
        .populate('values')
        .exec(),
      this.pageModel.countDocuments().exec(),
    ]);
    const res = {
      message: 'Pages have been fetched successfully',
      payload: data,
      totalCount: total,
      count: data.length,
    };
    return res;
  }

  async findOne(id: ObjectId): Promise<createRes> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Page id is not valid.');
    const page = await this.pageModel
      .findById(id)
      .populate('projects')
      .populate('values')
      .exec();
    if (!page) throw new NotFoundException('Page is not found.');
    const res = {
      message: 'Page have been fetched successfully.',
      payload: page,
    };
    return res;
  }

  async create(data: page): Promise<createRes> {
    try {
      const createdPage = await this.pageModel.create(data);
      const res = {
        message: 'Page has been created successfully',
        payload: createdPage,
      };
      return res;
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new ConflictException(`${field} already exists`);
      }
      throw new InternalServerErrorException('Could not create page');
    }
  }
  async updateOne(id: ObjectId, updateData: UpdatePageDto) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Page is is not valid');
    const result = await this.pageModel.findOneAndUpdate(
      { _id: id },
      updateData,
    );
    return {
      message: 'Page updated successfully.',
      result,
    };
  }

  async delete() {
    const result = await this.pageModel.deleteMany();
    return {
      message: 'Pages deleted successfully.',
      result,
    };
  }

  async deleteOne(id: ObjectId) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Page id is not valid.');
    const result = await this.pageModel.deleteOne({ _id: id });
    return {
      message: 'Page deleted successfully.',
      result,
    };
  }
}
