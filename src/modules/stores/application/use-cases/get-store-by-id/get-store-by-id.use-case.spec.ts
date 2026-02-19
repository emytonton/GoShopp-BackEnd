import { GetStoreByIdUseCase } from './get-store-by-id.use-case';
import { InMemoryStoresRepository } from '../../../domain/repositories/in-memory-stores.repository';
import { Store } from '../../../domain/entities/store.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetStoreByIdUseCase', () => {
  let inMemoryStoresRepository: InMemoryStoresRepository;
  let sut: GetStoreByIdUseCase;

  beforeEach(() => {
    inMemoryStoresRepository = new InMemoryStoresRepository();
    sut = new GetStoreByIdUseCase(inMemoryStoresRepository);
  });

  it('deve conseguir buscar os detalhes públicos de uma loja pelo ID', async () => {
    const store = Store.create(
      {
        ownerId: 'user-123',
        name: 'Super Store',
        description: 'A melhor loja',
        document: '123',
      },
      'store-id-123',
    );

    await inMemoryStoresRepository.create(store);

    const response = await sut.execute({ id: 'store-id-123' });

    expect(response.store).toBeTruthy();
    expect(response.store.name).toBe('Super Store');
  });

  it('deve disparar erro 404 se a loja não existir', async () => {
    await expect(() => sut.execute({ id: 'id-falso' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('não deve permitir visualizar uma loja que foi suspensa (Banida)', async () => {
    const store = Store.create(
      {
        ownerId: 'user-123',
        name: 'Loja Pirata',
        description: 'Desc',
        document: '123',
        status: 'SUSPENDED',
      },
      'store-id-pirata',
    );

    await inMemoryStoresRepository.create(store);

    await expect(() =>
      sut.execute({ id: 'store-id-pirata' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
