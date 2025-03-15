/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}
  async updateUser(userId: number, dto: UserDto) {
    const updatedUser = await this.databaseService.user.update({
      where: { id: userId },
      data: { ...dto },
    });
    const { hash, ...user } = updatedUser;

    return user;
  }
}
