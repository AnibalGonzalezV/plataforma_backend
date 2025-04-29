import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'couriers' })
export class Courier {
  @PrimaryGeneratedColumn({ name: 'courier_id' })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'vehicle_type' })
  vehicleType: string;

  @Column({ default: false })
  available: boolean;
}
