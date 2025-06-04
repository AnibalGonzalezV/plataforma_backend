import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsNumber()
  storeId?: number;

  @IsOptional()
  @IsString()
  name?: string;
}
