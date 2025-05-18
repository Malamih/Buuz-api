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
import {
  createProjectRes,
  getProjectRes,
  ProjectService,
} from './project.service';
import { CreateProjectDto } from './dtos/create-project.dt';
import { ObjectId } from 'mongoose';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<getProjectRes> {
    return this.projectService.findAll(page, limit);
  }
  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.projectService.findOne(id);
  }
  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() project: CreateProjectDto): Promise<createProjectRes> {
    return await this.projectService.create(project);
  }
  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteProject(@Param('id') id: ObjectId) {
    return this.projectService.deleteProject(id);
  }
  @Delete()
  @UseGuards(AuthGuard())
  deleteAllProjects() {
    return this.projectService.deleteAllProjects();
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  updateProject(@Param('id') id: ObjectId, @Body() body: UpdateProjectDto) {
    return this.projectService.updateProject(id, body);
  }
}
