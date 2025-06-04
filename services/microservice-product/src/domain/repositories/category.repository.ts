import { DataSource, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async createCategory(category: Partial<Category>): Promise<Category> {
    const newCategory = this.create(category);
    return this.save(newCategory);
  }

  async findById(id: number): Promise<Category | null> {
    return this.findOne({ where: { categoryId: id }, relations: ['products'] });
  }

  async findAll(): Promise<Category[]> {
    return this.find({ relations: ['products'] });
  }

  async updateCategory(
    id: number,
    update: Partial<Category>,
  ): Promise<Category | null> {
    await this.update(id, update);
    return this.findById(id);
  }

  async deleteCategory(id: number): Promise<void> {
    await this.delete(id);
  }
}
