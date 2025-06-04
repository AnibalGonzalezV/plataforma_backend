import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Tag } from './tag.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  categoryId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  quantity: number;

  @Column('numeric', { precision: 15, scale: 0 })
  price: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.products, { cascade: true })
  @JoinTable({
    name: 'products_tags',
    joinColumn: { name: 'product_id', referencedColumnName: 'productId' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tagId' },
  })
  tags: Tag[];
}
