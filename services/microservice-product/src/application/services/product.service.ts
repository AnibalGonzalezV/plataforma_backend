import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Product } from 'src/domain/entities/product.entity';
import { ProductRepository } from 'src/domain/repositories/product.repository';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { HttpService } from '@nestjs/axios';
import { last, lastValueFrom } from 'rxjs';
import { In } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly httpService: HttpService,
  ) {}

  private async validateStore(storeId: number): Promise<void> {
    try {
      await lastValueFrom(
        this.httpService.get(
          `${process.env.USER_SERVICE_URL}/stores/${storeId}`,
        ),
      );
    } catch (err) {
      throw new NotFoundException(`Tienda con ID ${storeId} no encontrada`);
    }
  }

  async create(dto: CreateProductDto): Promise<Product> {
    await this.validateStore(dto.storeId);
    return this.productRepository.createProduct(dto);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findByStoreId(storeId: number): Promise<Product[]> {
    return this.productRepository.findByStoreId(storeId);
  }

  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async update(
    id: number,
    updateDto: UpdateProductDto,
    userId: number,
  ): Promise<Product | null> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    const storeId = product.storeId;

    if (!storeId) {
      throw new NotFoundException(`Tienda asociada al producto no encontrada`);
    }

    const storeResponse = await lastValueFrom(
      this.httpService.get(`${process.env.USER_SERVICE_URL}/stores/${storeId}`),
    );
    const store = storeResponse.data;

    if (!store.owner || store.owner.id !== userId) {
      throw new UnauthorizedException(
        'No tienes permiso para actualizar este producto',
      );
    }

    if (updateDto.storeId && updateDto.storeId !== storeId) {
      await this.validateStore(updateDto.storeId);
    }

    return this.productRepository.updateProduct(id, updateDto);
  }

  async delete(id: number): Promise<void> {
    return this.productRepository.deleteProduct(id);
  }

  async findByCategoryId(categoryId: number): Promise<Product[]> {
    return this.productRepository.findByCategoryId(categoryId);
  }

  async findByTagId(tagId: number): Promise<Product[]> {
    return this.productRepository.findByTagId(tagId);
  }

  async bulkCheck(productIds: number[]): Promise<any[]> {
    const products = await this.productRepository.findBy({
      productId: In(productIds),
    });
    return products.map((p) => ({
      productId: p.productId,
      name: p.name,
      quantity: p.quantity,
      price: p.price,
    }));
  }

  async decreaseStock(
    items: { productId: number; quantity: number }[],
  ): Promise<{ message: string }> {
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundException(
          `Producto con ID ${item.productId} no encontrado`,
        );
      }
      if (product.quantity < item.quantity) {
        throw new NotFoundException(
          `Stock insuficiente para el producto ${product.name}`,
        );
      }
      product.quantity -= item.quantity;
      await this.productRepository.save(product);
    }
    return { message: 'Stock actualizado correctamente' };
  }
}
