import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/Guards/jwt-auth.guard';
import { UserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  getMe(@Req() Req: Request) {
    return Req.user;
  }

  @Patch('update/:userId')
  updateUser(@Param('userId') userId: string, @Body() dto: UserDto) {
    return this.userService.updateUser(+userId, dto);
  }
}
