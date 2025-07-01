// src/domain/repositories/review.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from 'src/application/dtos/create-review.dto';

export class ReviewRepository extends Repository<Review> {
  constructor(private dataSource: DataSource) {
    super(Review, dataSource.createEntityManager());
  }

  async createReview(
    orderId: number,
    userId: number,
    dto: CreateReviewDto,
  ): Promise<Review> {
    const newReview = this.create({
      order_id: orderId,
      user_id: userId,
      score: dto.score,
      comment: dto.comment,
    });

    return this.save(newReview);
  }

  async findById(orderId: number, userId: number): Promise<Review | null> {
    return this.findOne({
      where: { order_id: orderId, user_id: userId },
    });
  }

  async findAll(): Promise<Review[]> {
    return this.find();
  }

  async findByOrder(orderId: number): Promise<Review[]> {
    return this.find({
      where: { order_id: orderId },
    });
  }

  async findByUser(userId: number): Promise<Review[]> {
    return this.find({
      where: { user_id: userId },
    });
  }

  async deleteReview(orderId: number, userId: number): Promise<void> {
    await this.delete({ order_id: orderId, user_id: userId });
  }
}
