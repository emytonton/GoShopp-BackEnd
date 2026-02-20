import { GetMyProductsUseCase } from './get-my-products.use-case';
import { InMemoryProductsRepository } from '../../../domain/repositories/in-memory-products.repository';
import { InMemoryStoresRepository } from '../../../../stores/domain/repositories/in-memory-stores.repository';
import { Store } from '../../../../stores/domain/entities/store.entity';
import { Product } from '../../../domain/entities/product.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetMyProductsUseCase', () => {
  let productsRepository: InMemoryProductsRepository;
  let storesRepository: InMemoryStoresRepository;
  let sut: GetMyProductsUseCase;

  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    storesRepository = new InMemoryStoresRepository();
    sut = new GetMyProductsUseCase(productsRepository, storesRepository);
  });

  it('deve conseguir listar os produtos da loja do usuário', async () => {
    const store = Store.create(
      { ownerId: 'user-1', name: 'Loja', description: '...', document: '123' },
      'store-1',
    );
    await storesRepository.create(store);

    const product1 = Product.create({
      storeId: 'store-1',
      name: 'A',
      description: 'A',
      price: 10,
      stock: 5,
    });
    const product2 = Product.create({
      storeId: 'store-1',
      name: 'B',
      description: 'B',
      price: 20,
      stock: 10,
    });
    await productsRepository.create(product1);
    await productsRepository.create(product2);

    const { products } = await sut.execute({ ownerId: 'user-1' });

    expect(products).toHaveLength(2);
    expect(products[0].name).toBe('A');
  });

  it('deve disparar erro se o usuário não tiver loja', async () => {
    await expect(() =>
      sut.execute({ ownerId: 'sem-loja' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
