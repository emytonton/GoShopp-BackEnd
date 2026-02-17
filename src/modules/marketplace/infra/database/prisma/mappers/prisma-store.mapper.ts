import { Store as PrismaStore } from '@prisma/client';
import { Store } from '../../../../domain/entities/store.entity';

export class PrismaStoreMapper {
  static toPersistence(store: Store) {
    return {
      id: store.id,
      ownerId: store.ownerId,
      name: store.name,
      description: store.description,
      createdAt: store.createdAt,
    };
  }

  static toDomain(raw: PrismaStore): Store {
    return Store.create(
      {
        ownerId: raw.ownerId,
        name: raw.name,
        description: raw.description ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: new Date(),
      },
      raw.id,
    );
  }
}
