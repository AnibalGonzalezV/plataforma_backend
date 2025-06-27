import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsNumber()
  storeId: number;

  @IsNumber()
  clientId: number;

  @IsOptional()
  @IsNumber()
  courierId?: number;

  @IsString()
  deliveryType: string;

  @IsOptional()
  @IsString()
  deliveryState?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
