import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/domain/entities/review.entity';
import { ReviewRepository } from 'src/domain/repositories/review.repository';
import { ReviewService } from 'src/application/services/review.service';
import { ReviewController } from '../controllers/review.controller';
import { DataSource } from 'typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), HttpModule],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    {
      provide: ReviewRepository,
      useFactory: (dataSource: DataSource) => new ReviewRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [ReviewService],
})
export class ReviewModule {}
