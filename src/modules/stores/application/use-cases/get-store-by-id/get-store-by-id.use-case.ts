import { Injectable, NotFoundException } from '@nestjs/common';
import { StoresRepository } from '../../../domain/repositories/stores-repository.interface';
import { Store } from '../../../domain/entities/store.entity';

interface GetStoreByIdRequest {
  id: string;
}

interface GetStoreByIdResponse {
  store: Store;
}

@Injectable()
export class GetStoreByIdUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute(request: GetStoreByIdRequest): Promise<GetStoreByIdResponse> {
    const store = await this.storesRepository.findById(request.id);

    if (!store) {
      throw new NotFoundException('Loja não encontrada.');
    }

    if (store.status === 'SUSPENDED') {
      throw new NotFoundException('Loja indisponível no momento.');
    }

    return { store };
  }
}
