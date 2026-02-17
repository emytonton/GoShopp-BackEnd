import { BadRequestException, Injectable } from '@nestjs/common';
import { StoresRepository } from '../../domain/repositories/stores-repository.interface';
import { Store } from '../../domain/entities/store.entity';
import { UsersRepository } from '../../../identity/domain/repositories/users-repository.interface';

interface CreateStoreRequest {
  ownerId: string;
  name: string;
  description?: string;
}

@Injectable()
export class CreateStoreUseCase {
  constructor(
    private storesRepository: StoresRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(request: CreateStoreRequest) {
    const { ownerId, name, description } = request;

    const owner = await this.usersRepository.findById(ownerId);
    if (!owner) {
      throw new BadRequestException('User not found');
    }

    const storeAlreadyExists =
      await this.storesRepository.findByOwnerId(ownerId);
    if (storeAlreadyExists) {
      throw new BadRequestException('User already has a store');
    }

    const store = Store.create({
      ownerId,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.storesRepository.create(store);

    return {
      storeId: store.id,
    };
  }
}
