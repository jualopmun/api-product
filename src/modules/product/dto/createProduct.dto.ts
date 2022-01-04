import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsString()
  description: string;
}
