import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../../domain/repositories/users-repository.interface';

interface LoginRequest {
  email: string;
  passwordRaw: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    private usersRepo: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async execute({ email, passwordRaw }: LoginRequest) {
    const user = await this.usersRepo.findByEmail(email);

    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      passwordRaw,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id });

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
