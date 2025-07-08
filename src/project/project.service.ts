import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { project } from './schemas/project.schema';
import mongoose, { isValidObjectId, ObjectId, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { page } from 'src/page/schemas/page.schema';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { Portoflio } from 'src/portfolios/schemas/portfolio';
import { CreateProjectDto } from './dtos/create-project.dt';

export interface getProjectRes {
  message: string;
  payload: project[];
  count: number;
  totalCount: number;
}

export interface createProjectRes {
  message: string;
  project: project;
}

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(project.name) private projectModel: mongoose.Model<project>,
    @InjectModel(page.name) private pageModel: mongoose.Model<page>,
    @InjectModel(Portoflio.name)
    private portfolioModel: mongoose.Model<Portoflio>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 999,
    filters?: { type?: string; client?: string },
  ): Promise<getProjectRes> {
    const queryFilters: any = {};

    if (filters?.type) {
      queryFilters.type = filters.type;
    }

    if (filters?.client) {
      if (isValidObjectId(filters.client)) {
        queryFilters.$or = [
          { client: new Types.ObjectId(filters.client) },
          { client: filters.client },
        ];
      } else {
        queryFilters.client = filters.client;
      }
    }

    const [data, total] = await Promise.all([
      this.projectModel
        .find(queryFilters)
        .populate({ path: 'client', select: '-__v -projects' })
        .exec(),
      this.projectModel.countDocuments().exec(),
    ]);

    return {
      message: 'Projects have been fetched successfully',
      payload: data,
      count: data.length,
      totalCount: total,
    };
  }

  async findOne(id: ObjectId | string) {
    if (id == 'first') {
      const project = await this.projectModel.findOne();
      if (!project) return { message: 'There is no projects', project: {} };
      return {
        message: 'Project have been fetched successfully.',
        project,
      };
    }
    if (!isValidObjectId(id) && id != 'first')
      throw new BadRequestException('Project id is not valid.');
    const project = await this.projectModel.findById(id).populate('client');
    if (!project) throw new NotFoundException('Project is not found!');
    return {
      message: 'Project have been fetched successfully.',
      project,
    };
  }

  async create(data: CreateProjectDto): Promise<createProjectRes> {
    if (data.page && !isValidObjectId(data.page))
      throw new BadRequestException('Page is is not valid');
    const portfolioExists = await this.portfolioModel.findById(data.client);
    if (!portfolioExists) throw new NotFoundException('Client is not found.');

    const page = data.page ? await this.pageModel.findById(data.page) : null;
    if (data.page && !page) throw new NotFoundException('Page is not found.');

    const projectData = await this.projectModel.create({
      ...data,
      ...(data.page ? { page: new Types.ObjectId(data.page) } : {}),
      client: new Types.ObjectId(data.client),
    });

    await this.portfolioModel.findByIdAndUpdate(data.client, {
      $push: { projects: projectData._id },
    });

    return {
      message: 'Project created successfully.',
      project: projectData,
    };
  }

  async deleteProject(id: ObjectId) {
    const project = await this.projectModel.findById(id);
    if (!project) throw new NotFoundException('Project not found');

    const result = await this.projectModel.findByIdAndDelete(id).exec();

    await this.portfolioModel.findByIdAndUpdate(project.client, {
      $pull: { projects: id },
    });

    return {
      message: 'Project have been deleted successfully.',
      result,
    };
  }
  async deleteAllProjects() {
    const result = await this.projectModel.deleteMany();
    return {
      message: 'Projects have been deleted.',
      result,
    };
  }

  async updateProject(id: ObjectId, dataToUpdate: UpdateProjectDto) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Project id is not valid.');

    const project = await this.projectModel.findById(id);
    if (!project) throw new NotFoundException('Project is not found.');

    if (
      dataToUpdate.client &&
      dataToUpdate.client.toString() !== project.client.toString()
    ) {
      if (!isValidObjectId(dataToUpdate.client))
        throw new BadRequestException('Client id is not valid.');

      const newClient = await this.portfolioModel.findById(dataToUpdate.client);
      if (!newClient) throw new NotFoundException('New client not found.');

      await this.portfolioModel.findByIdAndUpdate(project.client, {
        $pull: { projects: id },
      });

      await this.portfolioModel.findByIdAndUpdate(dataToUpdate.client, {
        $addToSet: { projects: id },
      });
    }

    const result = await this.projectModel
      .findByIdAndUpdate(id, dataToUpdate, {
        new: true,
      })
      .populate({
        path: 'client',
        select: 'name',
      });

    return {
      message: 'Project has been updated',
      result,
    };
  }
}
