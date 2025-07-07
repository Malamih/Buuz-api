import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dtos/create-portfolio';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}
  @Get()
  async getPortfolios(@Query('name') name: string) {
    const filters = {
      ...(name ? { name: { $regex: name, $options: 'i' } } : {}),
    };
    return await this.portfoliosService.findAll(filters);
  }

  @Get('fields')
  async getPortfoliosWithFields(@Query('fields') fields: string) {
    const arrayFields = fields
      .replace(/[^a-zA-Z0-9, ]/g, '')
      .split(',')
      .filter(Boolean);
    return await this.portfoliosService.findAllByFields(arrayFields);
  }

  @Get(':id')
  async getPortfolio(@Param('id') id: string) {
    return await this.portfoliosService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ]),
  )
  async createPortfolio(
    @UploadedFiles()
    files: { image: Express.Multer.File; logo: Express.Multer.File },
    @Body() data: CreatePortfolioDto,
  ) {
    if (!files.image || !files.logo) {
      throw new BadRequestException({
        fieldErrors: {
          ...(!files.image ? { image: 'Portfolio image is required.' } : {}),
          ...(!files.logo ? { logo: 'Portfolio logo is required.' } : {}),
        },
      });
    }
    return await this.portfoliosService.create(
      data,
      files.image[0],
      files.logo[0],
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ]),
  )
  async updatePortfolio(
    @UploadedFiles()
    files: { image: Express.Multer.File; logo: Express.Multer.File },
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return await this.portfoliosService.update(
      id,
      data,
      files.image && files.image[0],
      files.logo && files.logo[0],
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deletePortfolio(@Param('id') id: string) {
    return await this.portfoliosService.delete(id);
  }

  @Delete()
  @UseGuards(AuthGuard())
  async deletePortfolios() {
    return await this.portfoliosService.deleteAll();
  }
}
