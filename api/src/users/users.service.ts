import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const _user = await this.findOneByEmail(createUserDto.email);
    if (_user) {
      throw new HttpException(
        'There is already an account with this email!',
        HttpStatus.CONFLICT,
      );
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    const createdUser = new this.UserModel({
      email: createUserDto.email,
      name: createUserDto.name,
      password: hash,
    });
    await createdUser.save();
    const user = createdUser.toJSON();
    delete user.password;
    return user;
  }

  findOneByEmail(email: string) {
    return this.UserModel.findOne({ email }).exec();
  }

  findOne(id: string) {
    return this.UserModel.findOne({ id }, { password: 0, _id: 0 }).exec();
  }
}
