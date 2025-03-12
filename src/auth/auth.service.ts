import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
// import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}
  async signIn(dto: AuthDto) {
    // find user by email
    const user = await this.databaseService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //if user not exist throw  error
    if (!user) throw new ForbiddenException('credential incorrect');

    // compare password
    const passwordMatches = await argon.verify(user.hash, dto.hash);

    //if password incorrect throw exception
    if (!passwordMatches) throw new ForbiddenException('credential incorrect');
    user.hash = '';

    //send back the user
    return user;
  }

  async signUp(dto: AuthDto) {
    try {
      //generate the hashed password
      const hashedPassword = await argon.hash(dto.hash);

      // save the new user in the database
      const user = await this.databaseService.user.create({
        data: {
          email: dto.email,
          hash: hashedPassword,
        },
      });
      user.hash = '';

      // return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('credential taken');
        }
      }

      throw error;
    }
  }
}
