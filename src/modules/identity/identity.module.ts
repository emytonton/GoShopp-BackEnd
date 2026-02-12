import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/infra/prisma.service';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { UsersRepository } from './domain/repositories/users-repository.interface';
import { PrismaUsersRepository } from './infra/database/prisma/repositories/prisma-users.repository';
import { RegisterUserController } from './presentation/controllers/register-user.controller';

@Module({
  controllers: [RegisterUserController],
  providers: [
    PrismaService,
    RegisterUserUseCase,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [RegisterUserUseCase],
})
export class IdentityModule {}
