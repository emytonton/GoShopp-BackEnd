import { Module } from '@nestjs/common';
import { ProductsController } from './presentation/controllers/products.controller';
import { CreateProductUseCase } from './application/use-cases/create-product/create-product.use-case';
import { GetMyProductsUseCase } from './application/use-cases/get-my-products/get-my-products.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product/update-product.use-case';
import { ProductsRepository } from './domain/repositories/products-repository.interface';
import { PrismaProductsRepository } from './infra/database/prisma/repositories/prisma-products.repository';
import { StoresModule } from '../stores/stores.module';
import { PrismaService } from '../../shared/infra/prisma.service';

@Module({
  imports: [StoresModule],
  controllers: [ProductsController],
  providers: [
    PrismaService,
    CreateProductUseCase,
    GetMyProductsUseCase,
    UpdateProductUseCase,
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
  ],
})
export class ProductsModule {}
