import { DeleteStoreUseCase } from './delete-store.use-case';
import { InMemoryStoresRepository } from '../../../domain/repositories/in-memory-stores.repository';
import { Store } from '../../../domain/entities/store.entity';

describe('DeleteStoreUseCase', () => {
  let inMemoryStoresRepository: InMemoryStoresRepository;
  let sut: DeleteStoreUseCase;

  beforeEach(() => {
    inMemoryStoresRepository = new InMemoryStoresRepository();
    sut = new DeleteStoreUseCase(inMemoryStoresRepository);
  });

  it('deve conseguir encerrar (soft delete) uma loja', async () => {
    const store = Store.create({
      ownerId: 'user-1',
      name: 'Loja para Deletar',
      description: '...',
      document: '123',
    });
    await inMemoryStoresRepository.create(store);

    const response = await sut.execute({ ownerId: 'user-1' });

    expect(response.store.status).toBe('SUSPENDED');
    expect(inMemoryStoresRepository.items[0].status).toBe('SUSPENDED');
  });
});
