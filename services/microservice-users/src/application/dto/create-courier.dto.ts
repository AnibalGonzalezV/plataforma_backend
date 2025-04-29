import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateCourierDto {
  @IsNumber()
  userId: number;

  @IsString()
  vehicleType: string;

  @IsOptional()
  available?: boolean;
}
