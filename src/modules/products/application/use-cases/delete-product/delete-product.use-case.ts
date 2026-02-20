import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ProductsRepository } from '../../../domain/repositories/products-repository.interface';
import { StoresRepository } from '../../../../stores/domain/repositories/stores-repository.interface';

interface DeleteProductRequest {
  ownerId: string;
  productId: string;
}

@Injectable()
export class DeleteProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private storesRepository: StoresRepository,
  ) {}

  async execute(request: DeleteProductRequest): Promise<void> {
    const { ownerId, productId } = request;

    const product = await this.productsRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    const store = await this.storesRepository.findByOwnerId(ownerId);
    if (!store || product.storeId !== store.id) {
      throw new ForbiddenException(
        'Você não tem permissão para remover este produto.',
      );
    }

    Object.assign(product.props, {
      status: 'INACTIVE',
      updatedAt: new Date(),
    });

    await this.productsRepository.save(product);
  }
}
