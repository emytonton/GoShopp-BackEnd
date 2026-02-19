import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../shared/infra/prisma.service'; // O caminho blindado contra a Vercel!
import { StoresRepository } from '../../../../domain/repositories/stores-repository.interface';
import { Store } from '../../../../domain/entities/store.entity';
import { PrismaStoreMapper } from '../mappers/prisma-store.mapper';

@Injectable()
export class PrismaStoresRepository implements StoresRepository {
  constructor(private prisma: PrismaService) {}

  async create(store: Store): Promise<void> {
    const data = PrismaStoreMapper.toPrisma(store);

    await this.prisma.store.create({
      data,
    });
  }

  async findById(id: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      return null;
    }

    return PrismaStoreMapper.toDomain(store);
  }

  async findByOwnerId(ownerId: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({
      where: { ownerId },
    });

    if (!store) {
      return null;
    }

    return PrismaStoreMapper.toDomain(store);
  }

  async findByName(name: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({
      where: { name },
    });

    if (!store) {
      return null;
    }

    return PrismaStoreMapper.toDomain(store);
  }

  async save(store: Store): Promise<void> {
    const data = PrismaStoreMapper.toPrisma(store);

    await this.prisma.store.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
