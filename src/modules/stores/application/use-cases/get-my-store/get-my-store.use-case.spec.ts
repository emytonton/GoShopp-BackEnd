import { GetMyStoreUseCase } from './get-my-store.use-case';
import { InMemoryStoresRepository } from '../../../domain/repositories/in-memory-stores.repository';
import { Store } from '../../../domain/entities/store.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetMyStoreUseCase', () => {
  let inMemoryStoresRepository: InMemoryStoresRepository;
  let sut: GetMyStoreUseCase;

  beforeEach(() => {
    inMemoryStoresRepository = new InMemoryStoresRepository();
    sut = new GetMyStoreUseCase(inMemoryStoresRepository);
  });

  it('deve conseguir buscar a loja do usuário logado', async () => {
    const store = Store.create({
      ownerId: 'user-123',
      name: 'Loja do João',
      description: 'Desc',
      document: '123',
    });
    await inMemoryStoresRepository.create(store);

    const response = await sut.execute({ ownerId: 'user-123' });

    expect(response.store).toBeTruthy();
    expect(response.store.name).toBe('Loja do João');
  });

  it('deve disparar erro 404 se o usuário não tiver uma loja', async () => {
    await expect(() =>
      sut.execute({ ownerId: 'user-sem-loja' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
