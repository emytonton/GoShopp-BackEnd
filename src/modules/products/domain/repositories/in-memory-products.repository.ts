import { ProductsRepository } from './products-repository.interface';
import { Product } from '../entities/product.entity';

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];

  create(product: Product): Promise<void> {
    this.items.push(product);
    return Promise.resolve();
  }

  findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id === id);
    return Promise.resolve(product ?? null);
  }

  findByStoreId(storeId: string): Promise<Product[]> {
    const products = this.items.filter((item) => item.storeId === storeId);
    return Promise.resolve(products);
  }

  save(product: Product): Promise<void> {
    const index = this.items.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      this.items[index] = product;
    }
    return Promise.resolve();
  }
}
