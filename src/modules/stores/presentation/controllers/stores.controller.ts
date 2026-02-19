import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CreateStoreUseCase } from '../../application/use-cases/create-store/create-store.use-case';
import { CreateStoreDto } from '../dtos/create-store.dto';
import { AuthGuard } from '../../../identity/presentation/guards/auth.guard';

interface AuthRequest {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('stores')
export class StoresController {
  constructor(private readonly createStoreUseCase: CreateStoreUseCase) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req: AuthRequest, @Body() body: CreateStoreDto) {
    const ownerId = req.user.sub;

    const { store } = await this.createStoreUseCase.execute({
      ownerId,
      name: body.name,
      description: body.description,
      document: body.document,
    });

    return {
      id: store.id,
      name: store.name,
      status: store.status,
      createdAt: store.createdAt,
    };
  }
}
