import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async login(user: UserDocument) {
    const payload = { email: user.email, name: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getMe(req: Request) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const user = this.jwtService.decode(token);
    return this.usersService.findOne(user.sub);
  }
}
