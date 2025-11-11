import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Public()
  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }
}
