import { User as PrismaUser } from '@prisma/client';
import { User } from '../../../../domain/entities/user.entity';

export class PrismaUserMapper {
  static toPersistence(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
    };
  }

  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        passwordHash: raw.passwordHash,
        createdAt: raw.createdAt,
        updatedAt: new Date(),
        deletedAt: raw.deletedAt ? new Date(raw.deletedAt) : null,
      },
      raw.id,
    );
  }
}
