import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { clientSchema } from './schemas/client.schema';
import { AdminModule } from 'src/admin/admin.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    AdminModule,
    AdminModule,
    MongooseModule.forFeature([{ name: 'Client', schema: clientSchema }]),
  ],
  providers: [ClientsService],
  controllers: [ClientsController],
})
export class ClientsModule {}
