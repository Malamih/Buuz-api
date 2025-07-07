import { Module } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { PortfoliosController } from './portfolios.controller';
import { AdminModule } from 'src/admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Portoflio, PortoflioSchema } from './schemas/portfolio';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    AdminModule,
    CloudinaryModule,
    MongooseModule.forFeature([
      { name: Portoflio.name, schema: PortoflioSchema },
    ]),
  ],
  providers: [PortfoliosService],
  controllers: [PortfoliosController],
})
export class PortfoliosModule {}
