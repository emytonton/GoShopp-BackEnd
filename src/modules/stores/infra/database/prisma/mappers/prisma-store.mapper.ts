import { Store as RawStore } from '@prisma/client';
import { Store, StoreStatus } from '../../../../domain/entities/store.entity';

export class PrismaStoreMapper {
  static toPrisma(store: Store) {
    return {
      id: store.id,
      ownerId: store.ownerId,
      name: store.name,
      description: store.description,
      document: store.document,
      status: store.status,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt ?? undefined,
    };
  }

  static toDomain(raw: RawStore): Store {
    return Store.create(
      {
        ownerId: raw.ownerId,
        name: raw.name,
        description: raw.description,
        document: raw.document,
        status: raw.status as StoreStatus,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }
}
