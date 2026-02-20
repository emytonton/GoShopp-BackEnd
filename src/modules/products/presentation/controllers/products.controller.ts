import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { CreateProductUseCase } from '../../application/use-cases/create-product/create-product.use-case';
import { GetMyProductsUseCase } from '../../application/use-cases/get-my-products/get-my-products.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product/update-product.use-case';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { AuthGuard } from '../../../identity/presentation/guards/auth.guard';

interface AuthRequest {
  user: { sub: string; email: string };
}

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getMyProductsUseCase: GetMyProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req: AuthRequest, @Body() body: CreateProductDto) {
    const ownerId = req.user.sub;

    const { product } = await this.createProductUseCase.execute({
      ownerId,
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
    });

    return {
      id: product.id,
      storeId: product.storeId,
      name: product.name,
      price: product.price,
      stock: product.stock,
      status: product.status,
    };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMyProducts(@Request() req: AuthRequest) {
    const ownerId = req.user.sub;

    const { products } = await this.getMyProductsUseCase.execute({ ownerId });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      status: product.status,
      createdAt: product.createdAt,
    }));
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Request() req: AuthRequest,
    @Param('id') productId: string,
    @Body() body: UpdateProductDto,
  ) {
    const ownerId = req.user.sub;

    const { product } = await this.updateProductUseCase.execute({
      ownerId,
      productId,
      ...body,
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      status: product.status,
      updatedAt: product.updatedAt,
    };
  }
}
