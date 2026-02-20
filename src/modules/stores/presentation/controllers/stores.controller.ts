import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  Patch,
} from '@nestjs/common';
import { UpdateStoreUseCase } from '../../application/use-cases/update-store/update-store.use-case';
import { UpdateStoreDto } from '../dtos/update-store.dto';
import { CreateStoreUseCase } from '../../application/use-cases/create-store/create-store.use-case';
import { GetMyStoreUseCase } from '../../application/use-cases/get-my-store/get-my-store.use-case';
import { GetStoreByIdUseCase } from '../../application/use-cases/get-store-by-id/get-store-by-id.use-case';
import { SearchStoresUseCase } from '../../application/use-cases/search-stores/search-stores.use-case';
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
  constructor(
    private readonly createStoreUseCase: CreateStoreUseCase,
    private readonly getMyStoreUseCase: GetMyStoreUseCase,
    private readonly getStoreByIdUseCase: GetStoreByIdUseCase,
    private readonly searchStoresUseCase: SearchStoresUseCase,
    private readonly updateStoreUseCase: UpdateStoreUseCase,
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

  @UseGuards(AuthGuard)
  @Patch('me')
  async update(@Request() req: AuthRequest, @Body() body: UpdateStoreDto) {
    const ownerId = req.user.sub;

    const { store } = await this.updateStoreUseCase.execute({
      ownerId,
      name: body.name,
      description: body.description,
    });

    return {
      id: store.id,
      name: store.name,
      description: store.description,
      status: store.status,
      updatedAt: store.updatedAt,
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

  @Get()
  async search(@Query('q') query?: string) {
    const { stores } = await this.searchStoresUseCase.execute({ query });
    return stores.map((store) => ({
      id: store.id,
      name: store.name,
      description: store.description,
      status: store.status,
      createdAt: store.createdAt,
    }));
  }
}
