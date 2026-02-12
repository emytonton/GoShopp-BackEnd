import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../../domain/repositories/users-repository.interface';
import { User } from '../../domain/entities/user.entity';

interface RegisterUserRequest {
  name: string;
  email: string;
  passwordRaw: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(request: RegisterUserRequest) {
    const { name, email, passwordRaw } = request;

    const userAlreadyExists = await this.usersRepository.findByEmail(email);
    if (userAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = `hashed_${passwordRaw}`;

    const user = User.create({
      name,
      email,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.usersRepository.create(user);

    return {
      userId: user.id,
    };
  }
}
