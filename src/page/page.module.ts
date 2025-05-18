// page.module.ts
import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { MongooseModule } from '@nestjs/mongoose';
import { page, pageSchema } from './schemas/page.schema';
import { PageController } from './page.controller';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: page.name, schema: pageSchema }]),
    AdminModule,
  ],
  providers: [PageService],
  controllers: [PageController],
  exports: [PageService],
})
export class PageModule {}
