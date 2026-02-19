import { Injectable, NotFoundException } from '@nestjs/common';
import { StoresRepository } from '../../../domain/repositories/stores-repository.interface';
import { Store } from '../../../domain/entities/store.entity';

interface GetMyStoreRequest {
  ownerId: string;
}

interface GetMyStoreResponse {
  store: Store;
}

@Injectable()
export class GetMyStoreUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute(request: GetMyStoreRequest): Promise<GetMyStoreResponse> {
    const { ownerId } = request;
    const store = await this.storesRepository.findByOwnerId(ownerId);

    if (!store) {
      throw new NotFoundException('Nenhuma loja encontrada para este usuário.');
    }

    return {
      store,
    };
  }
}
