import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('orders_items')
export class OrderItem {
  @PrimaryColumn({ name: 'order_id' })
  orderId: number;

  @PrimaryColumn({ name: 'product_id' })
  productId: number;

  @Column({ type: 'numeric', precision: 4, scale: 0 })
  quantity: number;
}
