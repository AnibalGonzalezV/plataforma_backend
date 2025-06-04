import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  tagId: number;

  @Column()
  name: string;

  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];
}
