import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/domain/entities/category.entity';
import { CategoryRepository } from 'src/domain/repositories/category.repository';
import { CategoryService } from 'src/application/services/category.service';
import { CategoryController } from '../controllers/category.controller';
import { DataSource } from 'typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), HttpModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: CategoryRepository,
      useFactory: (dataSource: DataSource) =>
        new CategoryRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
