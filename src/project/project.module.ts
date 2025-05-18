import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { project, projectSchema } from './schemas/project.schema';
import { page, pageSchema } from 'src/page/schemas/page.schema';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: project.name, schema: projectSchema }]),
    MongooseModule.forFeature([{ name: page.name, schema: pageSchema }]),
    AdminModule,
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
