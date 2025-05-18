import { Module } from '@nestjs/common';
import { ValueService } from './value.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Value, valueSchema } from './schema/value.schema';
import { ValueController } from './value.controller';
import { page, pageSchema } from 'src/page/schemas/page.schema';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    AdminModule,
    MongooseModule.forFeature([{ name: Value.name, schema: valueSchema }]),
    MongooseModule.forFeature([{ name: page.name, schema: pageSchema }]),
  ],
  providers: [ValueService],
  controllers: [ValueController],
  exports: [ValueService],
})
export class ValueModule {}
