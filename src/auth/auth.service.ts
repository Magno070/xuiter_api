import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  age: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(credentials: LoginData) {
    if (!credentials) throw new BadRequestException('credentials is required');

    if (!credentials.password || credentials.password.length < 8)
      throw new BadRequestException('8 characters password is required');

    try {
      await this.userService.findByUsername(credentials.username);
    } catch (e) {
      if (e.name === 'NotFoundException') {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    const user = await this.userService.findByUsername(credentials.username);

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    // Gerar o token JWT
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: RegisterData): Promise<{ message: string }> {
    if (!userData) throw new BadRequestException('credentials is required');
    if (!userData.username)
      throw new BadRequestException('username is required');
    if (!userData.password)
      throw new BadRequestException('password is required');
    if (userData.password.length < 8)
      throw new BadRequestException('8 characters password is required');
    if (userData.age === undefined || userData.age === null)
      throw new BadRequestException('age is required');

    try {
      await this.userService.findByUsername(userData.username);
      throw new BadRequestException('username already exists');
    } catch (error) {
      if (error.name !== 'NotFoundException') {
        throw error; // rethrow another error
      }
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await this.userService.create({
      ...userData,
      password: hashedPassword,
    });

    return { message: 'User registered successfully' };
  }
}
