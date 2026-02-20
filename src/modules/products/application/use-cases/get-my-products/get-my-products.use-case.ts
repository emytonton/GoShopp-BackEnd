import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../../../domain/repositories/products-repository.interface';
import { StoresRepository } from '../../../../stores/domain/repositories/stores-repository.interface';
import { Product } from '../../../domain/entities/product.entity';

interface GetMyProductsRequest {
  ownerId: string;
}

interface GetMyProductsResponse {
  products: Product[];
}

@Injectable()
export class GetMyProductsUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private storesRepository: StoresRepository,
  ) {}

  async execute(request: GetMyProductsRequest): Promise<GetMyProductsResponse> {
    const { ownerId } = request;

    const store = await this.storesRepository.findByOwnerId(ownerId);
    if (!store) {
      throw new NotFoundException('Você não possui uma loja cadastrada.');
    }

    const products = await this.productsRepository.findByStoreId(store.id);

    return { products };
  }
}
