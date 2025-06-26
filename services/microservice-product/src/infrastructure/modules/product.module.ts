import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/domain/entities/product.entity';
import { ProductRepository } from 'src/domain/repositories/product.repository';
import { ProductService } from 'src/application/services/product.service';
import { ProductController } from '../controllers/product.controller';
import { DataSource } from 'typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), HttpModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: ProductRepository,
      useFactory: (dataSource: DataSource) => new ProductRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
