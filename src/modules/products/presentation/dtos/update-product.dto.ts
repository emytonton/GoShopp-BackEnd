import { IsString, IsNumber, Min, Length, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @Length(3, 100)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(10, 500)
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
}
