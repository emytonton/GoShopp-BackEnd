import { CreateStoreUseCase } from './create-store.use-case';
import { InMemoryStoresRepository } from '../../../domain/repositories/in-memory-stores.repository';
import { ConflictException, BadRequestException } from '@nestjs/common';

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
      document: '12345678909',
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
      document: '12345678909',
    });

    await expect(() =>
      sut.execute({
        ownerId: 'user-123',
        name: 'Minha Segunda Loja',
        description: 'Desc',
        document: '98765432100',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('não deve permitir a criação com CPF inválido', async () => {
    await expect(() =>
      sut.execute({
        ownerId: 'user-999',
        name: 'Loja Hacker',
        description: 'Desc',
        document: '11122233344',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
