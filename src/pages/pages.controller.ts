import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { PagesService } from './pages.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('pages')
export class PagesController {
  constructor(private pagesService: PagesService) {}
  @Get()
  getPages() {
    return this.pagesService.getContent();
  }
  @UseGuards(AuthGuard())
  @Put()
  updateContent(@Body() data: any) {
    return this.pagesService.updateContent(data);
  }
}
