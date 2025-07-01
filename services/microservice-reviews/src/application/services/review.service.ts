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

  async createReview(
    orderId: number,
    userId: number,
    dto: CreateReviewDto,
  ): Promise<Review> {
    // Validar orden existe y pertenece al usuario (cliente)
    const orderResponse = await lastValueFrom(
      this.httpService.get(
        `${process.env.ORDER_SERVICE_URL}/orders/${orderId}`,
      ),
    );
    const order = orderResponse.data;

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.clientId !== userId) {
      throw new ConflictException(
        'User is not authorized to review this order',
      );
    }

    // Validar que usuario exista en microservicio users
    await this.validateUser(userId);

    // Verificar que no exista review previa para esa orden y usuario
    const existingReview = await this.reviewRepository.findById(
      orderId,
      userId,
    );
    if (existingReview) {
      throw new ConflictException('Review already exists');
    }

    return this.reviewRepository.createReview(orderId, userId, dto);
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
          return {
            ...review,
            user: {
              names: user.names,
              surnames: user.surnames,
              email: user.email,
              phone: user.phone,
            },
          };
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

    // Validar que el usuario sea el propietario de la review
    if (review.user_id !== userId) {
      throw new BadRequestException(
        'User is not authorized to delete this review',
      );
    }

    await this.reviewRepository.deleteReview(orderId, userId);
  }

  async findByStore(storeId: number): Promise<(Review & { user?: any })[]> {
    const ordersResponse = await lastValueFrom(
      this.httpService.get(
        `${process.env.ORDER_SERVICE_URL}/orders/by-store/${storeId}`,
      ),
    );

    const orders = ordersResponse.data;

    if (!orders || !orders.length) {
      throw new NotFoundException('No orders found for this store');
    }

    const ordersIds = orders.map((order) => order.id);

    const reviews = await this.reviewRepository.find({
      where: ordersIds.map((id) => ({ order_id: id })),
    });

    if (!reviews.length) {
      throw new NotFoundException('No reviews found for this store');
    }

    // Enriquecer cada review con datos de la orden
    const reviewsWithOrder = await Promise.all(
      reviews.map(async (review) => {
        try {
          const user = await this.validateUser(review.user_id);
          return {
            ...review,
            user: {
              names: user.names,
              surnames: user.surnames,
              email: user.email,
              phone: user.phone,
            },
          };
        } catch (error) {
          return review;
        }
      }),
    );
    return reviewsWithOrder;
  }
}
