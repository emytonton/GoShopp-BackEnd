import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../../domain/repositories/users-repository.interface';
import { User } from '../../../domain/entities/user.entity';

interface RegisterUserRequest {
  name: string;
  email: string;
  passwordRaw: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(private usersRepo: UsersRepository) {}

  async execute({ name, email, passwordRaw }: RegisterUserRequest) {
    const userAlreadyExists = await this.usersRepo.findByEmail(email);

    if (userAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(passwordRaw, 10);

    const user = User.create({
      name,
      email,
      passwordHash: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.usersRepo.create(user);

    return { userId: user.id };
  }
}
