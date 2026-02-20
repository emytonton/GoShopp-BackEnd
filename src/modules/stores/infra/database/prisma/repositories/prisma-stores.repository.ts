import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../../../shared/infra/prisma.service';
import { StoresRepository } from '../../../../domain/repositories/stores-repository.interface';
import { Store } from '../../../../domain/entities/store.entity';
import { PrismaStoreMapper } from '../mappers/prisma-store.mapper';

@Injectable()
export class PrismaStoresRepository implements StoresRepository {
  constructor(private prisma: PrismaService) {}

  async create(store: Store): Promise<void> {
    const data = PrismaStoreMapper.toPrisma(store);
    await this.prisma.store.create({ data });
  }

  async findById(id: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) return null;
    return PrismaStoreMapper.toDomain(store);
  }

  async findByOwnerId(ownerId: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({ where: { ownerId } });
    if (!store) return null;
    return PrismaStoreMapper.toDomain(store);
  }

  async findByName(name: string): Promise<Store | null> {
    const store = await this.prisma.store.findFirst({ where: { name } });
    if (!store) return null;
    return PrismaStoreMapper.toDomain(store);
  }

  // 👇 AQUI ESTÁ O NOVO MÉTODO (findByDocument) 👇
  async findByDocument(document: string): Promise<Store | null> {
    const store = await this.prisma.store.findFirst({ where: { document } });
    if (!store) return null;
    return PrismaStoreMapper.toDomain(store);
  }

  async save(store: Store): Promise<void> {
    const data = PrismaStoreMapper.toPrisma(store);

    const updateData: Prisma.StoreUpdateInput = Object.entries(data).reduce(
      (acc, [key, value]) => {
        if (key !== 'id' && key !== 'ownerId') {
          return { ...acc, [key]: value };
        }
        return acc;
      },
      {} as Prisma.StoreUpdateInput,
    );

    await this.prisma.store.update({
      where: { id: data.id },
      data: updateData,
    });
  }

  async search(query?: string): Promise<Store[]> {
    const rawStores = await this.prisma.store.findMany({
      where: {
        status: { not: 'SUSPENDED' },
        ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return rawStores.map((raw) => PrismaStoreMapper.toDomain(raw));
  }
}
