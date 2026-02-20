import { Product } from '../entities/product.entity';

export abstract class ProductsRepository {
  abstract create(product: Product): Promise<void>;
  abstract findById(id: string): Promise<Product | null>;
  abstract findByStoreId(storeId: string): Promise<Product[]>;
  abstract save(product: Product): Promise<void>;
}
