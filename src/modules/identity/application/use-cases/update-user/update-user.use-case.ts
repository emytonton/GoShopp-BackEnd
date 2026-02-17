import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../../domain/repositories/users-repository.interface';

@Injectable()
export class UpdateUserUseCase {
  constructor(private usersRepo: UsersRepository) {}

  async execute(userId: string, newName: string) {
    const user = await this.usersRepo.findById(userId);
    if (!user || user.isDeleted) throw new NotFoundException('User not found');

    user.updateName(newName);
    await this.usersRepo.save(user);

    return { id: user.id, name: user.name };
  }
}
