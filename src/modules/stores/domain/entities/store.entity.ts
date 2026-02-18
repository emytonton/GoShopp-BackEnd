import { Entity } from '../../../../core/domain/entities/entity';

export type StoreStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface StoreProps {
  ownerId: string;
  name: string;
  description: string;
  document: string;
  status: StoreStatus;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Store extends Entity<StoreProps> {
  get ownerId() {
    return this.props.ownerId;
  }
  get name() {
    return this.props.name;
  }
  get description() {
    return this.props.description;
  }
  get document() {
    return this.props.document;
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

  public deactivate() {
    this.props.status = 'INACTIVE';
    this.touch();
  }

  public activate() {
    this.props.status = 'ACTIVE';
    this.touch();
  }

  public suspend() {
    this.props.status = 'SUSPENDED';
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Omit<StoreProps, 'status' | 'createdAt'> & {
      status?: StoreStatus;
      createdAt?: Date;
    },
    id?: string,
  ) {
    const store = new Store(
      {
        ...props,
        status: props.status ?? 'ACTIVE',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return store;
  }
}
