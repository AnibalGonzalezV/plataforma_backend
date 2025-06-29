import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  order_id: number;

  @IsNumber()
  user_id: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  score: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
