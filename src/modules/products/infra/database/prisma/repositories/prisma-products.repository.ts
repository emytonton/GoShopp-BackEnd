import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../../../shared/infra/prisma.service';
import { ProductsRepository } from '../../../../domain/repositories/products-repository.interface';
import { Product } from '../../../../domain/entities/product.entity';
import { PrismaProductMapper } from '../mappers/prisma-product.mapper';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);
    await this.prisma.product.create({ data });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) return null;
    return PrismaProductMapper.toDomain(product);
  }

  async findByStoreId(storeId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({ where: { storeId } });
    return products.map((raw) => PrismaProductMapper.toDomain(raw));
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    const updateData: Prisma.ProductUpdateInput = Object.entries(data).reduce(
      (acc, [key, value]) => {
        if (key !== 'id' && key !== 'storeId') {
          return { ...acc, [key]: value };
        }
        return acc;
      },
      {} as Prisma.ProductUpdateInput,
    );

    await this.prisma.product.update({
      where: { id: data.id },
      data: updateData,
    });
  }
}
