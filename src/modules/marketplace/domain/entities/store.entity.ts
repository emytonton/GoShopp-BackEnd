import { Entity } from '../../../../core/domain/entities/entity';

export interface StoreProps {
  ownerId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
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

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: StoreProps, id?: string): Store {
    if (!props.ownerId) {
      throw new Error('Owner is required');
    }

    if (props.name.trim().length < 3) {
      throw new Error('Store name is too short');
    }

    return new Store(
      {
        ...props,
        name: props.name.trim(),
      },
      id,
    );
  }
}
