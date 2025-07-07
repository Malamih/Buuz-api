import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PageController } from './page/page.controller';
import { PageModule } from './page/page.module';
import { ProjectController } from './project/project.controller';
import { ProjectModule } from './project/project.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ValueController } from './value/value.controller';
import { ValueModule } from './value/value.module';
import { ClientsModule } from './clients/clients.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { PagesModule } from './pages/pages.module';
import { ServicesModule } from './services/services.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { EmployeesModule } from './employees/employees.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI as string),
    PageModule,
    ProjectModule,
    ValueModule,
    ClientsModule,
    AdminModule,
    PagesModule,
    ServicesModule,
    PortfoliosModule,
    EmployeesModule,
    CloudinaryModule,
  ],
  controllers: [
    AppController,
    PageController,
    ProjectController,
    ValueController,
    AdminController,
  ],
  providers: [AppService],
})
export class AppModule {}
