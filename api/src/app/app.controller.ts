import { Controller, Get, Request } from '@nestjs/common';
import { Request as NativeReq } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/utils/decorators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  async me(@Request() req: NativeReq) {
    return this.authService.getMe(req);
  }
}
