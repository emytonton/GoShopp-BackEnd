import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ProductsRepository } from '../../../domain/repositories/products-repository.interface';
import { StoresRepository } from '../../../../stores/domain/repositories/stores-repository.interface';
import { Product } from '../../../domain/entities/product.entity';

interface UpdateProductRequest {
  ownerId: string;
  productId: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private storesRepository: StoresRepository,
  ) {}

  async execute(request: UpdateProductRequest): Promise<{ product: Product }> {
    const { ownerId, productId, ...updates } = request;

    const product = await this.productsRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    const store = await this.storesRepository.findByOwnerId(ownerId);
    if (!store || product.storeId !== store.id) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este produto.',
      );
    }

    Object.assign(product.props, {
      ...updates,
      updatedAt: new Date(),
    });

    await this.productsRepository.save(product);

    return { product };
  }
}
