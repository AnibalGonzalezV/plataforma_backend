// src/application/dtos/bulk-check.dto.ts
import { IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkCheckDto {
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  productIds: number[];
}
