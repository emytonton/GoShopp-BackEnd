import { Injectable } from '@nestjs/common';
import { StoresRepository } from '../../../domain/repositories/stores-repository.interface';
import { Store } from '../../../domain/entities/store.entity';

interface SearchStoresRequest {
  query?: string;
}

interface SearchStoresResponse {
  stores: Store[];
}

@Injectable()
export class SearchStoresUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute(request: SearchStoresRequest): Promise<SearchStoresResponse> {
    const { query } = request;
    const stores = await this.storesRepository.search(query);
    return { stores };
  }
}
