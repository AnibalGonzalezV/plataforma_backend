// src/controllers/review.controller.ts
import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { ReviewService } from 'src/application/services/review.service';
import { CreateReviewDto } from 'src/application/dtos/create-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() dto: CreateReviewDto) {
    return this.reviewService.createReview(dto);
  }

  @Get('order/:orderId')
  findByOrder(@Param('orderId') orderId: number) {
    return this.reviewService.findByOrder(orderId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.reviewService.findByUser(userId);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Delete(':orderId/:userId')
  deleteReview(
    @Param('orderId') orderId: number,
    @Param('userId') userId: number,
  ) {
    return this.reviewService.deleteReview(orderId, userId);
  }
}
