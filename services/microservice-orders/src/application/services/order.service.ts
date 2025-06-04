import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OrderRepository } from 'src/domain/repositories/order.repository';
import { Order } from 'src/domain/entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly httpService: HttpService,
  ) {}

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

  findNewOrders(): Promise<Order[]> {
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
}
