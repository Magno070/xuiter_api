import { Injectable, BadRequestException } from '@nestjs/common';
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

    const user = await this.userService.findByUsername(credentials.username);
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    // Gerar o token JWT
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: RegisterData) {
    if (!userData) throw new BadRequestException('userData is required');
    const newUser = await this.userService.create(userData);
    return newUser;
  }
}
