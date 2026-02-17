import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/infra/prisma.service';

import { UsersRepository } from './domain/repositories/users-repository.interface';
import { PrismaUsersRepository } from './infra/database/prisma/repositories/prisma-users.repository';

import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';

import { RegisterUserController } from './presentation/controllers/register-user.controller';
import { UserProfileController } from './presentation/controllers/user-profile.controller';

@Module({
  controllers: [RegisterUserController, UserProfileController],
  providers: [
    PrismaService,
    RegisterUserUseCase,
    GetUserProfileUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [RegisterUserUseCase],
})
export class IdentityModule {}
