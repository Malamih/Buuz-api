import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { Service, ServiceSchema } from './schemas/services.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateServiceDto } from './dtos/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) readonly serviceModel: mongoose.Model<Service>,
  ) {}

  createService = async (data: CreateServiceDto) => {
    const serviceExists = await this.serviceModel.findOne({ name: data.name });
    if (serviceExists)
      throw new BadRequestException('Service with this name already exists.');
    const service = await this.serviceModel.create(data);
    return { message: 'Service have been created.', payload: service };
  };

  editService = async (id: string, data: { name?: string }) => {
    if (!mongoose.isValidObjectId(id))
      throw new BadRequestException('Invalid service ID');
    const service = await this.serviceModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    return { message: 'Service have been updated.', payload: service };
  };

  deleteService = async (id: string) => {
    if (!mongoose.isValidObjectId(id))
      throw new BadRequestException('Invalid service ID');
    const service = await this.serviceModel.findByIdAndDelete(id);
    return { message: 'Service have been deleted.', payload: service };
  };

  deleteServices = async () => {
    const services = await this.serviceModel.deleteMany({});
    return { message: 'All services have been deleted.', payload: services };
  };

  getService = async (id: string) => {
    if (!mongoose.isValidObjectId(id))
      throw new BadRequestException('Invalid service ID');
    const service = await this.serviceModel.findById(id);
    return { message: 'Service have been fetched.', payload: service };
  };

  getServices = async (query: { page?: number; limit?: number }) => {
    const { page = 1, limit = 999 } = query;
    const skip = (page - 1) * limit;
    const services = await this.serviceModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
    const totalCount = await this.serviceModel.countDocuments();
    return {
      message: 'Services have been fetched.',
      payload: services,
      totalCount,
      page,
      limit,
    };
  };
}
