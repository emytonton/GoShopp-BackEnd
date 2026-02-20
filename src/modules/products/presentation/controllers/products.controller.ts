import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
  Param,
  HttpCode,
} from '@nestjs/common';
import { CreateProductUseCase } from '../../application/use-cases/create-product/create-product.use-case';
import { GetMyProductsUseCase } from '../../application/use-cases/get-my-products/get-my-products.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product/delete-product.use-case';
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
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req: AuthRequest, @Body() body: CreateProductDto) {
    const { product } = await this.createProductUseCase.execute({
      ownerId: req.user.sub,
      ...body,
    });
    return product;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMyProducts(@Request() req: AuthRequest) {
    const { products } = await this.getMyProductsUseCase.execute({
      ownerId: req.user.sub,
    });
    return products;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Request() req: AuthRequest,
    @Param('id') productId: string,
    @Body() body: UpdateProductDto,
  ) {
    const { product } = await this.updateProductUseCase.execute({
      ownerId: req.user.sub,
      productId,
      ...body,
    });
    return product;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Request() req: AuthRequest, @Param('id') productId: string) {
    await this.deleteProductUseCase.execute({
      ownerId: req.user.sub,
      productId,
    });
  }
}
