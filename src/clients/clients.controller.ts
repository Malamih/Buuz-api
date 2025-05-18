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
import { ClientsService } from './clients.service';
import { ObjectId } from 'mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthGuard } from '@nestjs/passport';
import { Services } from './schemas/client.schema';

@Controller('clients')
export class ClientsController {
  constructor(private clientService: ClientsService) {}
  @Get()
  findAll(
    @Query('email') email: string,
    @Query('services') services: Services,
  ) {
    const filters = {
      ...(email && { email: { $regex: email, $options: 'i' } }),
      ...(services && { services: { $regex: services, $options: 'i' } }),
    };
    return this.clientService.findAll(filters);
  }
  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: ObjectId) {
    return this.clientService.findOne(id);
  }
  @Post()
  create(@Body() body: CreateClientDto) {
    return this.clientService.create(body);
  }
  @Put(':id')
  @UseGuards(AuthGuard())
  updateOne(@Param('id') id: ObjectId, @Body() body: UpdateClientDto) {
    return this.clientService.updateClient(id, body);
  }
  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteOne(@Param('id') id: ObjectId) {
    return this.clientService.deleteOne(id);
  }
  @Delete()
  @UseGuards(AuthGuard())
  deleteAll() {
    return this.clientService.deleteAll();
  }
}
