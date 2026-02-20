import { Product as RawProduct, Prisma } from '@prisma/client';
import {
  Product,
  ProductStatus,
} from '../../../../domain/entities/product.entity';

export class PrismaProductMapper {
  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id,
      storeId: product.storeId,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt ?? undefined,
    };
  }

  static toDomain(raw: RawProduct): Product {
    return new Product(
      {
        storeId: raw.storeId,
        name: raw.name,
        description: raw.description,
        price: raw.price,
        stock: raw.stock,
        status: raw.status as ProductStatus,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      raw.id,
    );
  }
}
