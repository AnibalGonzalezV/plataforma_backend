import { DataSource, In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Tag } from '../entities/tag.entity';
import { CreateProductDto } from 'src/application/dtos/create-product.dto';
import { UpdateProductDto } from 'src/application/dtos/update-product.dto';

export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    const category = await this.dataSource
      .getRepository(Category)
      .findOne({ where: { categoryId: dto.categoryId } });

    if (!category) throw new Error('Categoría no encontrada');

    const tags = dto.tagIds?.length
      ? await this.dataSource
          .getRepository(Tag)
          .find({ where: { tagId: In(dto.tagIds) } })
      : [];

    const newProduct = this.create({
      name: dto.name,
      description: dto.description,
      quantity: dto.quantity,
      price: dto.price,
      category,
      tags,
    });

    return this.save(newProduct);
  }

  async findById(id: number): Promise<Product | null> {
    return this.findOne({
      where: { productId: id },
      relations: ['category', 'tags'],
    });
  }

  async findAll(): Promise<Product[]> {
    return this.find({ relations: ['category', 'tags'] });
  }

  async updateProduct(
    id: number,
    dto: UpdateProductDto,
  ): Promise<Product | null> {
    const product = await this.findOne({
      where: { productId: id },
      relations: ['category', 'tags'],
    });
    if (!product) return null;

    if (dto.categoryId) {
      const category = await this.dataSource
        .getRepository(Category)
        .findOne({ where: { categoryId: dto.categoryId } });
      if (!category) throw new Error('Nueva categoría no encontrada');
      product.category = category;
    }

    if (dto.tagIds) {
      const tags = await this.dataSource
        .getRepository(Tag)
        .find({ where: { tagId: In(dto.tagIds) } });
      product.tags = tags;
    }

    Object.assign(product, dto);
    return this.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.delete(id);
  }

  async findByStoreId(storeId: number): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.tags', 'tag')
      .where('category.storeId = :storeId', { storeId })
      .getMany();
  }
}
