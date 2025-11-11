import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

interface UserData {
  username: string;
  password: string;
  age: number;
}

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: UserData): Promise<User> {
    if (!user) throw new BadRequestException('User is required');
    if (!user.password || user.password.length < 8)
      throw new BadRequestException('8 characters password is required');

    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);

    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async userById(userId: string): Promise<User> {
    if (!userId) throw new BadRequestException('userId is required');

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const userObj = user.toObject() as any;
    delete userObj.password;
    return userObj;
  }

  async findByUsername(username: string): Promise<User> {
    if (!username) throw new BadRequestException('username is required');
    const user = await this.userModel.findOne({ username: username });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
