import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CreateProductUseCase } from '../../application/use-cases/create-product/create-product.use-case';
import { CreateProductDto } from '../dtos/create-product.dto';
import { AuthGuard } from '../../../identity/presentation/guards/auth.guard';

interface AuthRequest {
  user: { sub: string; email: string };
}

@Controller('products')
export class ProductsController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

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
}
