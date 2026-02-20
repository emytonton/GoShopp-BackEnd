import { CreateStoreUseCase } from './create-store.use-case';
import { InMemoryStoresRepository } from '../../../domain/repositories/in-memory-stores.repository';
import { ConflictException } from '@nestjs/common';

describe('CreateStoreUseCase', () => {
  let inMemoryStoresRepository: InMemoryStoresRepository;
  let sut: CreateStoreUseCase;

  beforeEach(() => {
    inMemoryStoresRepository = new InMemoryStoresRepository();
    sut = new CreateStoreUseCase(inMemoryStoresRepository);
  });

  it('deve ser capaz de criar uma nova loja', async () => {
    const { store } = await sut.execute({
      ownerId: 'user-123',
      name: 'Loja Teste',
      description: 'Descrição da loja teste',
      document: '12345678900',
    });

    expect(store.id).toBeTruthy();
    expect(inMemoryStoresRepository.items).toHaveLength(1);
    expect(inMemoryStoresRepository.items[0].name).toBe('Loja Teste');
  });

  it('não deve permitir que o mesmo usuário crie duas lojas', async () => {
    await sut.execute({
      ownerId: 'user-123',
      name: 'Minha Primeira Loja',
      description: 'Desc',
      document: '111',
    });

    await expect(() =>
      sut.execute({
        ownerId: 'user-123',
        name: 'Minha Segunda Loja',
        description: 'Desc',
        document: '222',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
