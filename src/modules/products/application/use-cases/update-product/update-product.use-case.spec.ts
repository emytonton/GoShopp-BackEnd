import { UpdateProductUseCase } from './update-product.use-case';
import { InMemoryProductsRepository } from '../../../domain/repositories/in-memory-products.repository';
import { InMemoryStoresRepository } from '../../../../stores/domain/repositories/in-memory-stores.repository';
import { Store } from '../../../../stores/domain/entities/store.entity';
import { Product } from '../../../domain/entities/product.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('UpdateProductUseCase', () => {
  let productsRepository: InMemoryProductsRepository;
  let storesRepository: InMemoryStoresRepository;
  let sut: UpdateProductUseCase;

  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    storesRepository = new InMemoryStoresRepository();
    sut = new UpdateProductUseCase(productsRepository, storesRepository);
  });

  it('deve conseguir atualizar um produto próprio', async () => {
    const store = Store.create(
      { ownerId: 'user-1', name: 'Loja', description: '...', document: '123' },
      'store-1',
    );
    await storesRepository.create(store);

    const product = Product.create(
      {
        storeId: 'store-1',
        name: 'Original',
        description: '...',
        price: 10,
        stock: 5,
      },
      'product-1',
    );
    await productsRepository.create(product);

    // 2. Executa o update
    const { product: updated } = await sut.execute({
      ownerId: 'user-1',
      productId: 'product-1',
      price: 99.9,
      stock: 100,
    });

    expect(updated.price).toBe(99.9);
    expect(updated.stock).toBe(100);
    expect(updated.name).toBe('Original');
  });

  it('não deve conseguir atualizar produto de outra loja', async () => {
    const store1 = Store.create(
      { ownerId: 'user-1', name: 'L1', description: '.', document: '1' },
      's1',
    );
    const product1 = Product.create(
      { storeId: 's1', name: 'P1', description: '.', price: 1, stock: 1 },
      'p1',
    );
    await storesRepository.create(store1);
    await productsRepository.create(product1);

    await expect(() =>
      sut.execute({
        ownerId: 'user-2',
        productId: 'p1',
        price: 50,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('deve disparar erro se o produto não existir', async () => {
    await expect(() =>
      sut.execute({
        ownerId: 'user-1',
        productId: 'id-inexistente',
        price: 10,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
