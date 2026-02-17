import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../shared/infra/prisma.service';

import { UsersRepository } from './domain/repositories/users-repository.interface';
import { PrismaUsersRepository } from './infra/database/prisma/repositories/prisma-users.repository';

import { RegisterUserUseCase } from './application/use-cases/register-user/register-user.use-case';
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile/get-user-profile.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user/delete-user.use-case';
import { LoginUseCase } from './application/use-cases/login/login.use-case';

import { RegisterUserController } from './presentation/controllers/register-user.controller';
import { UserProfileController } from './presentation/controllers/user-profile.controller';
import { LoginController } from './presentation/controllers/login.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'meu_segredo_super_seguro_de_desenvolvimento',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [RegisterUserController, UserProfileController, LoginController],
  providers: [
    PrismaService,
    RegisterUserUseCase,
    GetUserProfileUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    LoginUseCase,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [RegisterUserUseCase, JwtModule],
})
export class IdentityModule {}
