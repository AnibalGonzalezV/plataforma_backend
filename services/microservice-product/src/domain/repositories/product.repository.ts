import { DataSource, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async createProduct(product: Partial<Product>): Promise<Product> {
    const newProduct = this.create(product);
    return this.save(newProduct);
  }

  async findById(id: number): Promise<Product | null> {
    return this.findOne({ where: { productId: id } });
  }

  async findAll(): Promise<Product[]> {
    return this.find({ relations: ['category'] });
  }

  async updateProduct(
    id: number,
    update: Partial<Product>,
  ): Promise<Product | null> {
    await this.update(id, update);
    return this.findById(id);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.delete(id);
  }
}
