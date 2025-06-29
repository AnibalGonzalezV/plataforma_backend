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

    const productIds = items.map((item) => item.productId);

    const { data: products } = await firstValueFrom(
      this.httpService.post(
        `${process.env.PRODUCT_SERVICE_URL}/products/bulk-check`,
        {
          productIds,
        },
      ),
    );

    let total = 0;
    for (const item of items) {
      const product = products.find((p) => p.productId === item.productId);
      if (!product) {
        throw new HttpException(
          `Producto con ID ${item.productId} no encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }
      if (product.quantity < item.quantity) {
        throw new HttpException(
          `Stock insuficiente para ${product.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      total += Number(product.price) * item.quantity;
    }

    await firstValueFrom(
      this.httpService.post(
        `${process.env.PRODUCT_SERVICE_URL}/products/decrease-stock`,
        items,
      ),
    );

    const order = await this.orderRepo.createOrder({
      ...orderData,
      courierId: null,
      deliveryState: 'pendiente',
      totalAmount: total,
    });

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
        `${process.env.USER_SERVICE_URL}/couriers/${courierId}`,
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
        `${process.env.USER_SERVICE_URL}/couriers/${courierId}`,
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

  async getOrderWithItems(id: number) {
    const order = await this.orderRepo.findById(id);
    if (!order)
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);

    const items = await this.orderItemRepo.findByOrderId(id);
    return { order, items };
  }

  async findOrdersByState(state: string): Promise<Order[]> {
    return this.orderRepo.findByState(state);
  }

  async markOrderAsDelivered(orderId: number): Promise<Order | null> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    const updatedOrder = await this.orderRepo.updateOrder(orderId, {
      deliveryState: 'entregado',
    });

    if (order.deliveryType === 'retiro_en_tienda') {
      // Si es retiro en tienda, no se necesita notificar al courier
      return updatedOrder;
    }

    if (order.courierId) {
      try {
        await firstValueFrom(
          this.httpService.patch(
            `${process.env.USER_SERVICE_URL}/couriers/${order.courierId}`,
            { available: true },
          ),
        );
      } catch (error) {
        console.error(
          `Error al marcar al courier ${order.courierId} como disponible:`,
          error.message || error,
        );
      }
    }

    return updatedOrder;
  }
}
