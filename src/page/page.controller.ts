import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'; // أزلنا @Inject
import { createRes, findAllRes, PageService } from './page.service';
import { CreatePageDto } from './dtos/create-page.dto';
import mongoose, { ObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePageDto } from './dtos/update-page.dto';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get()
  findAll(@Query('name') name: string): Promise<findAllRes> {
    const filters = { ...(name && { name: { $regex: name, $options: 'i' } }) };
    return this.pageService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId): Promise<createRes> {
    return this.pageService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() data: CreatePageDto): Promise<createRes> {
    return this.pageService.create(data);
  }
  @Delete()
  @UseGuards(AuthGuard())
  deleteMany() {
    return this.pageService.delete();
  }
  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteOne(@Param('id') id: ObjectId) {
    return this.pageService.deleteOne(id);
  }
  @Put(':id')
  @UseGuards(AuthGuard())
  updateOne(@Param('id') id: ObjectId, @Body() updatedData: UpdatePageDto) {
    return this.pageService.updateOne(id, updatedData);
  }
}
