import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateCourierDto {
  @IsOptional()
  @IsString()
  vehicleType?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
