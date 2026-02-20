import { Store } from '../entities/store.entity';

export abstract class StoresRepository {
  abstract create(store: Store): Promise<void>;
  abstract findById(id: string): Promise<Store | null>;
  abstract findByOwnerId(ownerId: string): Promise<Store | null>;
  abstract findByName(name: string): Promise<Store | null>;
  abstract save(store: Store): Promise<void>;
  abstract search(query?: string): Promise<Store[]>;
  abstract findByDocument(document: string): Promise<Store | null>;
}
