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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dtos/create-service.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  getServices(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 999,
  ) {
    return this.servicesService.getServices({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createService(@Body() body: CreateServiceDto) {
    return this.servicesService.createService(body);
  }

  @Get(':id')
  getService(@Param('id') id: string) {
    return this.servicesService.getService(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  editService(@Param('id') id: string, @Body() body: { name?: string }) {
    return this.servicesService.editService(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteService(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  deleteServices() {
    return this.servicesService.deleteServices();
  }
}
