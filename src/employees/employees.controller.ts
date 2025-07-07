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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async findAll(@Query('name') name: string) {
    const filters = {
      ...(name ? { name: { $regex: name, $options: 'i' } } : {}),
    };
    return await this.employeesService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.employeesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() data: CreateEmployeeDto,
  ) {
    if (!image) {
      throw new BadRequestException({
        fieldErrors: { image: 'Employee image is required.' },
      });
    }
    return await this.employeesService.create(data, image);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile() image: Express.Multer.File,
    @Body() data: UpdateEmployeeDto,
    @Param('id') id: string,
  ) {
    return await this.employeesService.update(id, data, image);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async delete(@Param('id') id: string) {
    return await this.employeesService.delete(id);
  }

  @Delete()
  @UseGuards(AuthGuard())
  async deleteAll() {
    return await this.employeesService.deleteAll();
  }
}
