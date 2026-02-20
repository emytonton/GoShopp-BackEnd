import { CreateProductUseCase } from './create-product.use-case';
import { InMemoryProductsRepository } from '../../../domain/repositories/in-memory-products.repository';
import { InMemoryStoresRepository } from '../../../../stores/domain/repositories/in-memory-stores.repository';
import { Store } from '../../../../stores/domain/entities/store.entity';
import { NotFoundException } from '@nestjs/common';

describe('CreateProductUseCase', () => {
  let productsRepository: InMemoryProductsRepository;
  let storesRepository: InMemoryStoresRepository;
  let sut: CreateProductUseCase;

  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    storesRepository = new InMemoryStoresRepository();
    // Adeus 'any'! Passando as instâncias com a tipagem perfeita:
    sut = new CreateProductUseCase(productsRepository, storesRepository);
  });

  it('deve conseguir criar um novo produto para uma loja ativa', async () => {
    const store = Store.create(
      { ownerId: 'user-1', name: 'Loja', description: 'Desc', document: '123' },
      'store-id',
    );
    await storesRepository.create(store);

    const response = await sut.execute({
      ownerId: 'user-1',
      name: 'Camisa',
      description: 'Camisa Preta',
      price: 59.9,
      stock: 10,
    });

    expect(response.product.id).toBeTruthy();
    expect(response.product.storeId).toBe('store-id');
    expect(productsRepository.items).toHaveLength(1);
  });

  it('deve disparar erro se o usuário não tiver loja', async () => {
    await expect(() =>
      sut.execute({
        ownerId: 'sem-loja',
        name: 'A',
        description: 'B',
        price: 10,
        stock: 1,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
