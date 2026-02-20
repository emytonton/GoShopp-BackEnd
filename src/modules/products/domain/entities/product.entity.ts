import { Entity } from '../../../../core/domain/entities/entity';

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED';

export interface ProductProps {
  storeId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export class Product extends Entity<ProductProps> {
  get storeId() {
    return this.props.storeId;
  }
  get name() {
    return this.props.name;
  }
  get description() {
    return this.props.description;
  }
  get price() {
    return this.props.price;
  }
  get stock() {
    return this.props.stock;
  }
  get status() {
    return this.props.status;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Omit<ProductProps, 'createdAt' | 'status'>,
    id?: string,
  ) {
    return new Product(
      {
        ...props,
        status: 'ACTIVE',
        createdAt: new Date(),
      },
      id,
    );
  }
}
