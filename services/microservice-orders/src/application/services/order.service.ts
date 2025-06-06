import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OrderRepository } from 'src/domain/repositories/order.repository';
import { OrderItemRepository } from 'src/domain/repositories/order-item.repository';
import { Order } from 'src/domain/entities/order.entity';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { UpdateOrderItemDto } from '../dtos/update-order-item.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly httpService: HttpService,
    private readonly orderItemRepo: OrderItemRepository,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const { items, ...orderData } = dto;

    const order = await this.orderRepo.createOrder(orderData);

    const orderItems: OrderItem[] = items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
    }));

    await this.orderItemRepo.addItems(orderItems);

    return order;
  }

  async findAllOrders(): Promise<Order[]> {
    return this.orderRepo.findAll();
  }

  async findOrderById(id: number): Promise<Order | null> {
    return this.orderRepo.findById(id);
  }

  async getItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.orderItemRepo.findByOrderId(orderId);
  }

  async updateOrder(id: number, dto: UpdateOrderDto): Promise<Order | null> {
    return this.orderRepo.updateOrder(id, dto);
  }

  async deleteOrder(id: number): Promise<void> {
    return this.orderRepo.deleteOrder(id);
  }

  async countOrdersByDeliveryState() {
    return this.orderRepo.countOrdersByDeliveryState();
  }

  async updateOrderItemsQuantity(
    orderId: number,
    dto: UpdateOrderItemDto,
  ): Promise<void> {
    const { productId, quantity } = dto;
    await this.orderItemRepo.updateItemQuantity(orderId, productId, quantity);
  }

  async findNewOrders(): Promise<Order[]> {
    return this.orderRepo.findNewOrders();
  }

  async assignOrderToCourier(
    orderId: number,
    courierId: number,
  ): Promise<Order | null> {
    // 1. Verificar disponibilidad
    const { data: courier } = await firstValueFrom(
      this.httpService.get(
        `http://user-service:3002/users/couriers/${courierId}`,
      ),
    );

    if (!courier || !courier.available) {
      throw new HttpException(
        'Courier is not available',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 2. Asignar pedido localmente
    const updatedOrder = await this.orderRepo.assignOrderToCourier(
      orderId,
      courierId,
    );

    // 3. Marcar courier como no disponible
    await firstValueFrom(
      this.httpService.patch(
        `http://user-service:3002/users/couriers/${courierId}`,
        {
          available: false,
        },
      ),
    );

    return updatedOrder;
  }

  async deleteOrderItem(orderId: number, productId: number): Promise<void> {
    await this.orderItemRepo.deleteItem(orderId, productId);
  }

  async clearOrderItems(orderId: number): Promise<void> {
    await this.orderItemRepo.deleteByOrderId(orderId);
  }
}
