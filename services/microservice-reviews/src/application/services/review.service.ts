// src/application/services/review.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Review } from 'src/domain/entities/review.entity';
import { ReviewRepository } from 'src/domain/repositories/review.repository';
import { CreateReviewDto } from 'src/application/dtos/create-review.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly httpService: HttpService,
  ) {}

  // Validar existencia de usuario y enriquecimiento datos opcional
  private async validateUser(userId: number): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${process.env.USER_SERVICE_URL}/usuarios/${userId}`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async createReview(dto: CreateReviewDto): Promise<Review> {
    // Validar orden existe y pertenece al usuario (cliente)
    const orderResponse = await lastValueFrom(
      this.httpService.get(
        `${process.env.ORDER_SERVICE_URL}/orders/${dto.order_id}`,
      ),
    );
    const order = orderResponse.data;

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.client_id !== dto.user_id) {
      throw new ConflictException(
        'User is not authorized to review this order',
      );
    }

    // Validar que usuario exista en microservicio users
    await this.validateUser(dto.user_id);

    // Verificar que no exista review previa para esa orden y usuario
    const existingReview = await this.reviewRepository.findById(
      dto.order_id,
      dto.user_id,
    );
    if (existingReview) {
      throw new ConflictException('Review already exists');
    }

    return this.reviewRepository.createReview(dto);
  }

  async findByOrder(orderId: number): Promise<(Review & { user?: any })[]> {
    const reviews = await this.reviewRepository.findByOrder(orderId);
    if (!reviews.length) {
      throw new NotFoundException('No reviews found for this order');
    }

    // Enriquecer cada review con datos del usuario
    const reviewsWithUser = await Promise.all(
      reviews.map(async (review) => {
        try {
          const user = await this.validateUser(review.user_id);
          return { ...review, user };
        } catch {
          return review;
        }
      }),
    );

    return reviewsWithUser;
  }

  async findByUser(userId: number): Promise<Review[]> {
    // Validar usuario existe
    await this.validateUser(userId);

    const reviews = await this.reviewRepository.findByUser(userId);
    if (!reviews.length) {
      throw new NotFoundException('No reviews found for this user');
    }
    return reviews;
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.findAll();
  }

  async deleteReview(orderId: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.findById(orderId, userId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    await this.reviewRepository.deleteReview(orderId, userId);
  }
}
