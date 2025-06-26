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

  async findByName(name: string): Promise<Category | null> {
    return await this.findOne({ where: { name }, relations: ['products'] });
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

  async findByStoreId(storeId: number): Promise<Category[]> {
    return this.createQueryBuilder('category')
      .innerJoin('category.products', 'product')
      .where('product.storeId = :storeId', { storeId })
      .distinct(true)
      .getMany();
  }

  async findByStoreIdWithProducts(storeId: number): Promise<Category[]> {
    return this.createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'product')
      .where('product.storeId = :storeId', { storeId })
      .getMany();
  }
}
