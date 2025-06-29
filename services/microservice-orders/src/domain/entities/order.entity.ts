import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ name: 'order_id' })
  id: number;

  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'courier_id', nullable: true })
  courierId: number | null;

  @Column({ name: 'delivery_type' })
  deliveryType: string;

  @Column({ name: 'delivery_state' })
  deliveryState: string;

  @Column({ name: 'total_amount', type: 'numeric', precision: 15, scale: 0 })
  totalAmount: number;

  @CreateDateColumn({ name: 'order_date' })
  orderDate: Date;
}
