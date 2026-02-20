import { DeleteProductUseCase } from './delete-product.use-case';
import { InMemoryProductsRepository } from '../../../domain/repositories/in-memory-products.repository';
import { InMemoryStoresRepository } from '../../../../stores/domain/repositories/in-memory-stores.repository';
import { Store } from '../../../../stores/domain/entities/store.entity';
import { Product } from '../../../domain/entities/product.entity';
import { ForbiddenException } from '@nestjs/common';

describe('DeleteProductUseCase', () => {
  let productsRepository: InMemoryProductsRepository;
  let storesRepository: InMemoryStoresRepository;
  let sut: DeleteProductUseCase;

  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    storesRepository = new InMemoryStoresRepository();
    sut = new DeleteProductUseCase(productsRepository, storesRepository);
  });

  it('deve conseguir desativar um produto próprio', async () => {
    const store = Store.create(
      { ownerId: 'user-1', name: 'Loja', description: '...', document: '123' },
      'store-1',
    );
    await storesRepository.create(store);

    const product = Product.create(
      {
        storeId: 'store-1',
        name: 'Teclado',
        description: '...',
        price: 10,
        stock: 5,
      },
      'product-1',
    );
    await productsRepository.create(product);

    await sut.execute({
      ownerId: 'user-1',
      productId: 'product-1',
    });

    expect(productsRepository.items[0].status).toBe('INACTIVE');
  });

  it('não deve permitir que outro usuário delete o produto', async () => {
    const store = Store.create(
      { ownerId: 'dono', name: 'L', description: 'D', document: '1' },
      's1',
    );
    const product = Product.create(
      { storeId: 's1', name: 'P', description: 'D', price: 1, stock: 1 },
      'p1',
    );
    await storesRepository.create(store);
    await productsRepository.create(product);

    await expect(() =>
      sut.execute({ ownerId: 'hacker', productId: 'p1' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
