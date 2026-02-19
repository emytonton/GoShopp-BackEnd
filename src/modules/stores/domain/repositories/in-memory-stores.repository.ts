import { StoresRepository } from './stores-repository.interface';
import { Store } from '../entities/store.entity';

export class InMemoryStoresRepository implements StoresRepository {
  public items: Store[] = [];

  create(store: Store): Promise<void> {
    this.items.push(store);
    return Promise.resolve();
  }

  findById(id: string): Promise<Store | null> {
    const store = this.items.find((item) => item.id === id);
    return Promise.resolve(store || null);
  }

  findByOwnerId(ownerId: string): Promise<Store | null> {
    const store = this.items.find((item) => item.ownerId === ownerId);
    return Promise.resolve(store || null);
  }

  findByName(name: string): Promise<Store | null> {
    const store = this.items.find((item) => item.name === name);
    return Promise.resolve(store || null);
  }

  save(store: Store): Promise<void> {
    const index = this.items.findIndex((item) => item.id === store.id);
    if (index !== -1) {
      this.items[index] = store;
    }
    return Promise.resolve();
  }
  search(query?: string): Promise<Store[]> {
    let filtered = this.items.filter((store) => store.status !== 'SUSPENDED');
    if (query) {
      filtered = filtered.filter((store) =>
        store.name.toLowerCase().includes(query.toLowerCase()),
      );
    }
    return Promise.resolve(filtered);
  }
}
