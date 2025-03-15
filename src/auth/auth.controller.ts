import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //sign up endpoint the user
  @Post('register')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }
}
