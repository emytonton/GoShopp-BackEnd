import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ProductsRepository } from '../../../domain/repositories/products-repository.interface';
import { StoresRepository } from '../../../../stores/domain/repositories/stores-repository.interface';
import { Product } from '../../../domain/entities/product.entity';

interface CreateProductRequest {
  ownerId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface CreateProductResponse {
  product: Product;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private storesRepository: StoresRepository,
  ) {}

  async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
    const { ownerId, name, description, price, stock } = request;

    const store = await this.storesRepository.findByOwnerId(ownerId);

    if (!store) {
      throw new NotFoundException(
        'Você precisa ter uma loja para cadastrar produtos.',
      );
    }

    if (store.status !== 'ACTIVE') {
      throw new ForbiddenException(
        'Sua loja precisa estar ativa para adicionar produtos.',
      );
    }

    const product = Product.create({
      storeId: store.id,
      name,
      description,
      price,
      stock,
    });

    await this.productsRepository.create(product);

    return { product };
  }
}
