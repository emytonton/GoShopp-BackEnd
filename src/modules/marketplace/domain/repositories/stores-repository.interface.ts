import { Store } from '../entities/store.entity';

export abstract class StoresRepository {
  abstract create(store: Store): Promise<void>;
  abstract findByOwnerId(ownerId: string): Promise<Store | null>;
}
