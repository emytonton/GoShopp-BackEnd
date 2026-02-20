import { Injectable, NotFoundException } from '@nestjs/common';
import { StoresRepository } from '../../../domain/repositories/stores-repository.interface';
import { Store } from '../../../domain/entities/store.entity';

interface DeleteStoreRequest {
  ownerId: string;
}

interface DeleteStoreResponse {
  store: Store;
}

@Injectable()
export class DeleteStoreUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute(request: DeleteStoreRequest): Promise<DeleteStoreResponse> {
    const { ownerId } = request;

    const store = await this.storesRepository.findByOwnerId(ownerId);

    if (!store) {
      throw new NotFoundException('Loja não encontrada para este usuário.');
    }

    store.suspend();

    await this.storesRepository.save(store);

    return { store };
  }
}
