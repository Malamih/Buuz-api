import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { project, projectSchema } from './schemas/project.schema';
import { page, pageSchema } from 'src/page/schemas/page.schema';
import { AdminModule } from 'src/admin/admin.module';
import { Portoflio, PortoflioSchema } from 'src/portfolios/schemas/portfolio';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: project.name, schema: projectSchema }]),
    MongooseModule.forFeature([{ name: page.name, schema: pageSchema }]),
    MongooseModule.forFeature([
      { name: Portoflio.name, schema: PortoflioSchema },
    ]),
    AdminModule,
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
