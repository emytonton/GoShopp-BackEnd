import { SearchStoresUseCase } from './search-stores.use-case';
import { InMemoryStoresRepository } from '../../../domain/repositories/in-memory-stores.repository';
import { Store } from '../../../domain/entities/store.entity';

describe('SearchStoresUseCase', () => {
  let inMemoryStoresRepository: InMemoryStoresRepository;
  let sut: SearchStoresUseCase;

  beforeEach(() => {
    inMemoryStoresRepository = new InMemoryStoresRepository();
    sut = new SearchStoresUseCase(inMemoryStoresRepository);
  });

  it('deve conseguir listar todas as lojas ativas', async () => {
    await inMemoryStoresRepository.create(
      Store.create({
        ownerId: '1',
        name: 'Loja A',
        description: 'A',
        document: '1',
      }),
    );
    await inMemoryStoresRepository.create(
      Store.create({
        ownerId: '2',
        name: 'Loja B',
        description: 'B',
        document: '2',
      }),
    );

    const response = await sut.execute({});

    expect(response.stores).toHaveLength(2);
  });

  it('deve conseguir buscar uma loja pelo nome', async () => {
    await inMemoryStoresRepository.create(
      Store.create({
        ownerId: '1',
        name: 'Emilly Tech',
        description: 'Tech',
        document: '1',
      }),
    );
    await inMemoryStoresRepository.create(
      Store.create({
        ownerId: '2',
        name: 'Zezinho Roupas',
        description: 'Roupas',
        document: '2',
      }),
    );

    const response = await sut.execute({ query: 'Tech' });

    expect(response.stores).toHaveLength(1);
    expect(response.stores[0].name).toBe('Emilly Tech');
  });

  it('não deve retornar lojas que foram suspensas', async () => {
    await inMemoryStoresRepository.create(
      Store.create({
        ownerId: '1',
        name: 'Loja Boa',
        description: 'Boa',
        document: '1',
      }),
    );
    await inMemoryStoresRepository.create(
      Store.create({
        ownerId: '2',
        name: 'Loja Banida',
        description: 'Ruim',
        document: '2',
        status: 'SUSPENDED',
      }),
    );

    const response = await sut.execute({});

    expect(response.stores).toHaveLength(1);
    expect(response.stores[0].name).toBe('Loja Boa');
  });
});
