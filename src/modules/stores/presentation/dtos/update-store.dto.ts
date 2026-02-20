import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  @Length(3, 50, { message: 'O nome deve ter entre 3 e 50 caracteres' })
  name?: string;

  @IsOptional()
  @IsString()
  @Length(10, 255, {
    message: 'A descrição deve ter entre 10 e 255 caracteres',
  })
  description?: string;
}
