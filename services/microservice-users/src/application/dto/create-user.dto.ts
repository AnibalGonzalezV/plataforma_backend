import { IsEmail, IsString, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  names: string;

  @IsString()
  lastNames: string;

  @IsString()
  address: string;

  @IsNumber()
  phoneNumber: number;
}
