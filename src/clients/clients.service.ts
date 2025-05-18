import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  DeleteResult,
  isValidObjectId,
  ObjectId,
  UpdateResult,
} from 'mongoose';
import { Client } from './schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

export interface FindAllRes {
  message: string;
  payload: Client[];
}

export interface FindOneRes {
  message: string;
  payload: Client;
}

export interface CreateClientRes {
  message: string;
  payload: Client;
}

export interface UpdateClientRes {
  message: string;
  payload: UpdateResult;
}

export interface DeleteClientRes {
  message: string;
  payload: DeleteResult;
}

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private clientModel: mongoose.Model<Client>,
  ) {}
  async findAll(filters: {}): Promise<FindAllRes> {
    const clients = await this.clientModel.find(filters ? filters : {});
    return {
      message: 'Clients have been fetched successfully.',
      payload: clients,
    };
  }

  async findOne(id: ObjectId): Promise<FindOneRes> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Client id is not valid.');
    const client = await this.clientModel.findById(id);
    if (!client) throw new NotFoundException('Client is not found.');
    return {
      message: 'Client have been fetched successfully.',
      payload: client,
    };
  }

  async create(clientData: CreateClientDto): Promise<CreateClientRes> {
    const client = await this.clientModel.create(clientData);
    return {
      message: 'Client have been Created successfully.',
      payload: client,
    };
  }

  async updateClient(
    id: ObjectId,
    clientData: UpdateClientDto,
  ): Promise<UpdateClientRes> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Client id is not valid');
    const client = await this.clientModel.findById(id);
    if (!client) throw new NotFoundException('Client is not found.');
    const data = await this.clientModel.updateOne({ _id: id }, clientData);
    return {
      message: 'Client have been updated.',
      payload: data,
    };
  }

  async deleteOne(id: ObjectId): Promise<DeleteClientRes> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Client id is not valid');
    const client = await this.clientModel.findById(id);
    if (!client) throw new NotFoundException('Client is not found');
    const result = await this.clientModel.deleteOne({ _id: id });
    return {
      message: 'Client have been deleted successfully.',
      payload: result,
    };
  }

  async deleteAll() {
    const result = await this.clientModel.deleteMany();
    return {
      message: 'All clients have been deleted.',
      payload: result,
    };
  }
}
