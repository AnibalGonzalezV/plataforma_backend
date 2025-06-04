import { Injectable } from '@nestjs/common';
import { Product } from 'src/domain/entities/product.entity';
import { ProductRepository } from 'src/domain/repositories/product.repository';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(dto: CreateProductDto): Promise<Product> {
    return this.productRepository.createProduct(dto);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product | null> {
    return this.productRepository.updateProduct(id, dto);
  }

  async delete(id: number): Promise<void> {
    return this.productRepository.deleteProduct(id);
  }
}
