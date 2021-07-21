import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Query('albumId') albumId: number) {
    return this.appService.getHello(albumId);
  }
}
