import { DataSource, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

export class OrderRepository extends Repository<Order> {
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  async createOrder(order: Partial<Order>): Promise<Order> {
    const newOrder = this.create(order);
    return this.save(newOrder);
  }

  async findById(id: number): Promise<Order | null> {
    return this.findOne({ where: { id } });
  }

  async findAll(): Promise<Order[]> {
    return this.find();
  }

  async updateOrder(id: number, update: Partial<Order>): Promise<Order | null> {
    await this.update(id, update);
    return this.findById(id);
  }

  async deleteOrder(id: number): Promise<void> {
    await this.delete(id);
  }

  async countOrdersByDeliveryState(): Promise<
    { deliveryState: string; count: number }[]
  > {
    return this.createQueryBuilder('order')
      .select('order.deliveryState', 'deliveryState')
      .addSelect('COUNT(order.id)', 'count')
      .groupBy('order.deliveryState')
      .getRawMany();
  }

  async findNewOrders(): Promise<Order[]> {
    return this.find({ where: { deliveryState: 'nuevo' } });
  }

  async assignOrderToCourier(
    orderId: number,
    courierId: number,
  ): Promise<Order | null> {
    await this.updateOrder(orderId, { courierId, deliveryState: 'activo' });
    return this.findById(orderId);
  }
}
