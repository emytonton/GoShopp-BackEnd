import { Body, Controller, Post } from '@nestjs/common';
import { CreateStoreUseCase } from '../../application/use-cases/create-store.use-case';

interface CreateStoreBody {
  ownerId: string;
  name: string;
  description?: string;
}

@Controller('stores')
export class CreateStoreController {
  constructor(private createStore: CreateStoreUseCase) {}

  @Post()
  async handle(@Body() body: CreateStoreBody) {
    const { ownerId, name, description } = body;

    return await this.createStore.execute({
      ownerId,
      name,
      description,
    });
  }
}
