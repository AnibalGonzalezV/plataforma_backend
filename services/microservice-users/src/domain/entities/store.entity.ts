import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'stores' })
export class Store {
  @PrimaryGeneratedColumn({ name: 'store_id' })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'numeric', precision: 2, scale: 1, nullable: true })
  score: number | null; // Cambiado a nullable: true para permitir valores nulos
}
