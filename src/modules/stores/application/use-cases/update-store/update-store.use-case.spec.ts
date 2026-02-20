import { UpdateStoreUseCase } from './update-store.use-case';
import { InMemoryStoresRepository } from '../../../domain/repositories/in-memory-stores.repository';
import { Store } from '../../../domain/entities/store.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateStoreUseCase', () => {
  let inMemoryStoresRepository: InMemoryStoresRepository;
  let sut: UpdateStoreUseCase;

  beforeEach(() => {
    inMemoryStoresRepository = new InMemoryStoresRepository();
    sut = new UpdateStoreUseCase(inMemoryStoresRepository);
  });

  it('deve conseguir atualizar os detalhes da loja', async () => {
    const store = Store.create({
      ownerId: 'user-1',
      name: 'Loja Original',
      description: 'Desc Original',
      document: '123',
    });
    await inMemoryStoresRepository.create(store);

    const response = await sut.execute({
      ownerId: 'user-1',
      name: 'Loja Editada',
    });

    expect(response.store.name).toBe('Loja Editada');
  });

  it('deve disparar NotFoundException se o usuário não tiver loja', async () => {
    await expect(() =>
      sut.execute({
        ownerId: 'id-inexistente',
        name: 'Novo Nome',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
