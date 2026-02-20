import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { StoresRepository } from '../../../domain/repositories/stores-repository.interface';
import { Store } from '../../../domain/entities/store.entity';

interface UpdateStoreRequest {
  ownerId: string;
  name?: string;
  description?: string;
}

interface UpdateStoreResponse {
  store: Store;
}

@Injectable()
export class UpdateStoreUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute(request: UpdateStoreRequest): Promise<UpdateStoreResponse> {
    const { ownerId, name, description } = request;

    const store = await this.storesRepository.findByOwnerId(ownerId);

    if (!store) {
      throw new NotFoundException('Nenhuma loja encontrada para este usuário.');
    }

    if (name && name !== store.name) {
      const storeWithSameName = await this.storesRepository.findByName(name);
      if (storeWithSameName) {
        throw new ConflictException(
          'Já existe uma loja com este nome. Escolha outro.',
        );
      }
    }

    store.updateDetails(name, description);

    await this.storesRepository.save(store);

    return { store };
  }
}
