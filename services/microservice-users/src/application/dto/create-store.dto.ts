import { IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsNumber()
  userId: number;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsNumber()
  score?: number;
}
