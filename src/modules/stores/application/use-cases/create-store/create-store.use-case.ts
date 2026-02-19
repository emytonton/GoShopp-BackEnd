import { Injectable, ConflictException } from '@nestjs/common';
import { Store } from '../../../domain/entities/store.entity';
import { StoresRepository } from '../../../domain/repositories/stores-repository.interface';

interface CreateStoreRequest {
  ownerId: string;
  name: string;
  description: string;
  document: string;
}

interface CreateStoreResponse {
  store: Store;
}

@Injectable()
export class CreateStoreUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute(request: CreateStoreRequest): Promise<CreateStoreResponse> {
    const { ownerId, name, description, document } = request;

    const storeExistsForUser =
      await this.storesRepository.findByOwnerId(ownerId);
    if (storeExistsForUser) {
      throw new ConflictException(
        'Este usuário já possui uma loja cadastrada.',
      );
    }

    const storeNameAlreadyTaken = await this.storesRepository.findByName(name);
    if (storeNameAlreadyTaken) {
      throw new ConflictException(
        'Já existe uma loja com este nome. Por favor, escolha outro.',
      );
    }

    const store = Store.create({
      ownerId,
      name,
      description,
      document,
    });

    await this.storesRepository.create(store);

    return {
      store,
    };
  }
}
