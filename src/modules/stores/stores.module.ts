import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Necessário para o AuthGuard funcionar aqui
import { PrismaService } from '../../shared/infra/prisma.service';
import { StoresController } from './presentation/controllers/stores.controller';
import { CreateStoreUseCase } from './application/use-cases/create-store/create-store.use-case';
import { GetMyStoreUseCase } from './application/use-cases/get-my-store/get-my-store.use-case';
import { GetStoreByIdUseCase } from './application/use-cases/get-store-by-id/get-store-by-id.use-case';
import { StoresRepository } from './domain/repositories/stores-repository.interface';
import { PrismaStoresRepository } from './infra/database/prisma/repositories/prisma-stores.repository';

@Module({
  imports: [JwtModule],
  controllers: [StoresController],
  providers: [
    PrismaService,
    CreateStoreUseCase,
    GetMyStoreUseCase,
    GetStoreByIdUseCase,
    {
      provide: StoresRepository,
      useClass: PrismaStoresRepository,
    },
  ],
})
export class StoresModule {}
