import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}
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

    //send back the user
    return { token: await this.signInToken(user.id, user.email) };
  }

  async signUp(dto: AuthDto) {
    try {
      //generate the hashed password
      const hashedPassword = await argon.hash(dto.hash);

      // save the new user in the database
      const user = await this.databaseService.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          hash: hashedPassword,
        },
      });
      // return the saved user
      return { token: await this.signInToken(user.id, user.email) };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('credential taken');
        }
      }

      throw error;
    }
  }

  // signing jwt token
  async signInToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
