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
      },
      raw.id,
    );
  }
}
