import { DataSource, Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';

export class OrderItemRepository extends Repository<OrderItem> {
  constructor(private datasource: DataSource) {
    super(OrderItem, datasource.createEntityManager());
  }

  async addItems(items: OrderItem[]): Promise<OrderItem[]> {
    return this.save(items);
  }

  async findByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.find({ where: { orderId } });
  }

  async deleteByOrderId(orderId: number): Promise<void> {
    await this.delete({ orderId });
  }

  async updateItemQuantity(
    orderId: number,
    productId: number,
    quantity: number,
  ): Promise<void> {
    await this.update({ orderId, productId }, { quantity });
  }

  async deleteItem(orderId: number, productId: number): Promise<void> {
    await this.delete({ orderId, productId });
  }
}
