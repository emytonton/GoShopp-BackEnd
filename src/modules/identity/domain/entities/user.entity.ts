import { Entity } from '../../../../core/domain/entities/entity';

export interface UserProps {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
  get passwordHash() {
    return this.props.passwordHash;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get deletedAt() {
    return this.props.deletedAt;
  }

  get isDeleted() {
    return this.props.deletedAt !== null && this.props.deletedAt !== undefined;
  }

  updateName(newName: string) {
    if (newName.length < 3) throw new Error('Name is too short');
    this.props.name = newName;
    this.props.updatedAt = new Date();
  }

  delete() {
    if (this.isDeleted) throw new Error('User is already deleted');
    this.props.deletedAt = new Date();
    this.props.updatedAt = new Date();
  }

  static create(props: UserProps, id?: string): User {
    if (!props.email.includes('@')) throw new Error('Invalid email address');
    if (props.name.length < 3) throw new Error('Name is too short');
    return new User(props, id);
  }
}
