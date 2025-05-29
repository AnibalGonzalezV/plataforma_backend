import { Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/domain/repositories/order.repository';
import { Order } from 'src/domain/entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepo: OrderRepository) {}

  createOrder(dto: CreateOrderDto): Promise<Order> {
    return this.orderRepo.createOrder(dto);
  }

  findAllOrders(): Promise<Order[]> {
    return this.orderRepo.findAll();
  }

  findOrderById(id: number): Promise<Order | null> {
    return this.orderRepo.findById(id);
  }

  updateOrder(id: number, dto: UpdateOrderDto): Promise<Order | null> {
    return this.orderRepo.updateOrder(id, dto);
  }

  deleteOrder(id: number): Promise<void> {
    return this.orderRepo.deleteOrder(id);
  }

  countOrdersByDeliveryState() {
    return this.orderRepo.countOrdersByDeliveryState();
  }
}
