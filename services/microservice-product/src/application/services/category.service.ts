import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from 'src/domain/repositories/category.repository';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { Category } from 'src/domain/entities/category.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepository,
    private readonly httpService: HttpService,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepo.createCategory(dto);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.findAll();
  }

  async findById(id: number): Promise<Category | null> {
    return this.categoryRepo.findById(id);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category | null> {
    return this.categoryRepo.updateCategory(id, dto);
  }

  async delete(id: number): Promise<void> {
    return this.categoryRepo.deleteCategory(id);
  }

  async findByStoreId(storeId: number): Promise<Category[]> {
    return this.categoryRepo.findByStoreId(storeId);
  }

  async findByStoreIdWithProducts(storeId: number): Promise<Category[]> {
    return this.categoryRepo.findByStoreIdWithProducts(storeId);
  }
}
