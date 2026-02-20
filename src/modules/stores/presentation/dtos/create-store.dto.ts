import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da loja é obrigatório' })
  @Length(3, 50, { message: 'O nome deve ter entre 3 e 50 caracteres' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @Length(10, 255, {
    message: 'A descrição deve ter entre 10 e 255 caracteres',
  })
  description!: string;

  @IsString()
  @IsNotEmpty({ message: 'O documento (CPF/CNPJ) é obrigatório' })
  document!: string;
}
