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
} from '@nestjs/common';
import { findAllRes, ValueService } from './value.service';
import { CreateValueDto } from './dto/create-value.dto';
import { ObjectId } from 'mongoose';
import { UpdateValueDto } from './dto/update-value.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('values')
export class ValueController {
  constructor(private readonly valueService: ValueService) {}

  @Get()
  findAll(@Query('title') title: string): Promise<findAllRes> {
    const filters = {
      ...(title && { title: { $regex: title, $options: 'i' } }),
    };
    return this.valueService.findAll(filters);
  }
  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.valueService.findOne(id);
  }
  @Post()
  @UseGuards(AuthGuard())
  create(@Body() valueData: CreateValueDto) {
    return this.valueService.create(valueData);
  }
  @Put(':id')
  @UseGuards(AuthGuard())
  update(@Param('id') id: ObjectId, @Body() body: UpdateValueDto) {
    return this.valueService.updateOne(id, body);
  }
  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteOne(@Param('id') id: ObjectId) {
    return this.valueService.deleteOne(id);
  }
  @Delete()
  @UseGuards(AuthGuard())
  deleteAll() {
    return this.valueService.deleteAll();
  }
}
