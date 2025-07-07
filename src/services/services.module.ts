import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { AdminModule } from 'src/admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './schemas/services.schema';

@Module({
  imports: [
    AdminModule,
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
