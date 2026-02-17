import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/infra/prisma.service';
import { UsersRepository } from '../identity/domain/repositories/users-repository.interface';
import { PrismaUsersRepository } from '../identity/infra/database/prisma/repositories/prisma-users.repository';
import { CreateStoreUseCase } from './application/use-cases/create-store.use-case';
import { StoresRepository } from './domain/repositories/stores-repository.interface';
import { PrismaStoresRepository } from './infra/database/prisma/repositories/prisma-stores.repository';
import { CreateStoreController } from './presentation/controllers/create-store.controller';

@Module({
  controllers: [CreateStoreController],
  providers: [
    PrismaService,
    CreateStoreUseCase,
    {
      provide: StoresRepository,
      useClass: PrismaStoresRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
})
export class MarketplaceModule {}
