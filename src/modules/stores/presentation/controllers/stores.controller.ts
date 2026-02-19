import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateStoreUseCase } from '../../application/use-cases/create-store/create-store.use-case';
import { GetMyStoreUseCase } from '../../application/use-cases/get-my-store/get-my-store.use-case';
import { GetStoreByIdUseCase } from '../../application/use-cases/get-store-by-id/get-store-by-id.use-case';
import { CreateStoreDto } from '../dtos/create-store.dto'; // <-- A importação que estava faltando!
import { AuthGuard } from '../../../identity/presentation/guards/auth.guard';

interface AuthRequest {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('stores')
export class StoresController {
  constructor(
    private readonly createStoreUseCase: CreateStoreUseCase,
    private readonly getMyStoreUseCase: GetMyStoreUseCase,
    private readonly getStoreByIdUseCase: GetStoreByIdUseCase,
  ) {}

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

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Request() req: AuthRequest) {
    const ownerId = req.user.sub;
    const { store } = await this.getMyStoreUseCase.execute({ ownerId });
    return {
      id: store.id,
      name: store.name,
      description: store.description,
      document: store.document,
      status: store.status,
      createdAt: store.createdAt,
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const { store } = await this.getStoreByIdUseCase.execute({ id });
    return {
      id: store.id,
      name: store.name,
      description: store.description,
      status: store.status,
      createdAt: store.createdAt,
    };
  }
}
