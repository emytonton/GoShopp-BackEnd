import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../../domain/repositories/users-repository.interface';

@Injectable()
export class DeleteUserUseCase {
  constructor(private usersRepo: UsersRepository) {}

  async execute(userId: string) {
    const user = await this.usersRepo.findById(userId);
    if (!user || user.isDeleted) throw new NotFoundException('User not found');

    user.delete();
    await this.usersRepo.save(user);
  }
}
