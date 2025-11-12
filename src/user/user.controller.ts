import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  userById(@Query('userId') userId: string) {
    return this.userService.userById(userId);
  }
}
