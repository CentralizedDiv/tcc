import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { Public } from 'src/utils/decorators';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
