import { BadRequestException } from '@nestjs/common';
import { CreateStoreUseCase } from './create-store.use-case';
import { StoresRepository } from '../../domain/repositories/stores-repository.interface';
import { Store } from '../../domain/entities/store.entity';
import { UsersRepository } from '../../../identity/domain/repositories/users-repository.interface';
import { User } from '../../../identity/domain/entities/user.entity';

class InMemoryStoresRepository implements StoresRepository {
  public items: Store[] = [];

  create(store: Store): Promise<void> {
    this.items.push(store);
    return Promise.resolve();
  }

  findByOwnerId(ownerId: string): Promise<Store | null> {
    return Promise.resolve(
      this.items.find((store) => store.ownerId === ownerId) ?? null,
    );
  }
}

class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  create(user: User): Promise<void> {
    this.items.push(user);
    return Promise.resolve();
  }

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(
      this.items.find((user) => user.email === email) ?? null,
    );
  }

  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.items.find((user) => user.id === id) ?? null);
  }
}

describe('CreateStoreUseCase', () => {
  let storesRepository: InMemoryStoresRepository;
  let usersRepository: InMemoryUsersRepository;
  let sut: CreateStoreUseCase;

  beforeEach(() => {
    storesRepository = new InMemoryStoresRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateStoreUseCase(storesRepository, usersRepository);
  });

  it('should create a store for a valid owner', async () => {
    const user = User.create({
      name: 'Joao Silva',
      email: 'joao@shop.com',
      passwordHash: 'hashed_123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await usersRepository.create(user);

    const result = await sut.execute({
      ownerId: user.id,
      name: 'Minha Loja',
      description: 'Loja de tecnologia',
    });

    expect(result.storeId).toBeDefined();
    expect(storesRepository.items).toHaveLength(1);
    expect(storesRepository.items[0].ownerId).toBe(user.id);
  });

  it('should trim the store name before persisting', async () => {
    const user = User.create({
      name: 'Pedro Santos',
      email: 'pedro@shop.com',
      passwordHash: 'hashed_123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await usersRepository.create(user);

    await sut.execute({
      ownerId: user.id,
      name: '   Loja do Pedro   ',
    });

    expect(storesRepository.items[0].name).toBe('Loja do Pedro');
  });

  it('should not create a store for an unknown user', async () => {
    await expect(
      sut.execute({
        ownerId: '66bcfcb6be89bfde1c2be4af',
        name: 'Loja Fantasma',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should not create more than one store for the same owner', async () => {
    const user = User.create({
      name: 'Maria Souza',
      email: 'maria@shop.com',
      passwordHash: 'hashed_123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await usersRepository.create(user);

    await sut.execute({
      ownerId: user.id,
      name: 'Loja da Maria',
    });

    await expect(
      sut.execute({
        ownerId: user.id,
        name: 'Segunda Loja',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
