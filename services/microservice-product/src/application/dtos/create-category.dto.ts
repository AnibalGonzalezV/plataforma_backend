import { IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNumber()
  storeId: number;

  @IsString()
  name: string;
}
