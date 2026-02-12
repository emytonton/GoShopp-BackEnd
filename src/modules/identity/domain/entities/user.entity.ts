import { Entity } from '../../../../core/domain/entities/entity';

export interface UserProps {
  name: string;
  email: string;
  passwordHash: string; // O domínio não lida com senha crua, só hash
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserProps> {
  // Getters para proteger os dados (Encapsulamento)
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

  // Factory Method: A única forma de criar um usuário novo
  // Isso nos permite validar regras ANTES do objeto existir
  static create(props: UserProps, id?: string): User {
    // Regra de Negócio: Email deve ser válido (exemplo simples)
    if (!props.email.includes('@')) {
      throw new Error('Invalid email address');
    }

    // Regra de Negócio: Nome não pode ser vazio
    if (props.name.length < 3) {
      throw new Error('Name is too short');
    }

    return new User(props, id);
  }
}
