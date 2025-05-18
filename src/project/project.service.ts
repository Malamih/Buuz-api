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
  ) {}

  async findAll(page: number = 1, limit: number = 999): Promise<getProjectRes> {
    const [data, total] = await Promise.all([
      this.projectModel.find().exec(),
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
    const project = await this.projectModel.findById(id);
    if (!project) throw new NotFoundException('Project is not found!');
    return {
      message: 'Project have been fetched successfully.',
      project,
    };
  }

  async create(data: project): Promise<createProjectRes> {
    if (data.page && !isValidObjectId(data.page))
      throw new BadRequestException('Page is is not valid');
    const page = data.page ? await this.pageModel.findById(data.page) : null;
    if (data.page && !page) throw new NotFoundException('Page is not found.');
    const projectData = await this.projectModel.create(
      page ? { ...data, page: new Types.ObjectId(data.page) } : data,
    );
    return {
      message: 'Project created successfully.',
      project: projectData,
    };
  }

  async deleteProject(id: ObjectId) {
    const result = await this.projectModel.findByIdAndDelete(id).exec();
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
    const result = await this.projectModel.findByIdAndUpdate(id, dataToUpdate);
    return {
      message: 'Project have been updated',
      result,
    };
  }
}
