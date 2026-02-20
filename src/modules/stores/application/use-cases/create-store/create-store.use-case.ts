import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Store } from '../../../domain/entities/store.entity';
import { StoresRepository } from '../../../domain/repositories/stores-repository.interface';
import { DocumentValidator } from '../../../../../core/utils/document.validator';

interface CreateStoreRequest {
  ownerId: string;
  name: string;
  description: string;
  document: string;
}

interface CreateStoreResponse {
  store: Store;
}

@Injectable()
export class CreateStoreUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute(request: CreateStoreRequest): Promise<CreateStoreResponse> {
    const { ownerId, name, description, document } = request;

    if (!DocumentValidator.isValid(document)) {
      throw new BadRequestException(
        'O documento fornecido (CPF/CNPJ) é inválido.',
      );
    }

    const documentAlreadyInUse =
      await this.storesRepository.findByDocument(document);
    if (documentAlreadyInUse) {
      throw new ConflictException(
        'Este documento já está vinculado a outra loja.',
      );
    }

    const storeExistsForUser =
      await this.storesRepository.findByOwnerId(ownerId);
    if (storeExistsForUser) {
      throw new ConflictException(
        'Este usuário já possui uma loja cadastrada.',
      );
    }

    const storeNameAlreadyTaken = await this.storesRepository.findByName(name);
    if (storeNameAlreadyTaken) {
      throw new ConflictException(
        'Já existe uma loja com este nome. Por favor, escolha outro.',
      );
    }

    const store = Store.create({
      ownerId,
      name,
      description,
      document,
    });

    await this.storesRepository.create(store);

    return {
      store,
    };
  }
}
