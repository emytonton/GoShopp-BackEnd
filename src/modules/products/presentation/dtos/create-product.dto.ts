import { IsString, IsNumber, Min, Length } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(3, 100)
  name!: string;

  @IsString()
  @Length(10, 500)
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  stock!: number;
}
