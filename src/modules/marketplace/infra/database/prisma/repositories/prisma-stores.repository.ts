import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infra/prisma.service';
import { StoresRepository } from '../../../../domain/repositories/stores-repository.interface';
import { Store } from '../../../../domain/entities/store.entity';
import { PrismaStoreMapper } from '../mappers/prisma-store.mapper';

@Injectable()
export class PrismaStoresRepository implements StoresRepository {
  constructor(private prisma: PrismaService) {}

  async create(store: Store): Promise<void> {
    const data = PrismaStoreMapper.toPersistence(store);
    await this.prisma.store.create({ data });
  }

  async findByOwnerId(ownerId: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({
      where: { ownerId },
    });

    if (!store) return null;

    return PrismaStoreMapper.toDomain(store);
  }
}
