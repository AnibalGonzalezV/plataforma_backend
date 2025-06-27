import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { OrderService } from 'src/application/services/order.service';
import { CreateOrderDto } from 'src/application/dtos/create-order.dto';
import { UpdateOrderDto } from 'src/application/dtos/update-order.dto';
import { UpdateOrderItemDto } from 'src/application/dtos/update-order-item.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Get('all')
  findAll() {
    return this.orderService.findAllOrders();
  }

  @Get('new-orders')
  findNewOrders() {
    return this.orderService.findNewOrders();
  }

  @Get('state-count')
  countOrdersByDeliveryState() {
    return this.orderService.countOrdersByDeliveryState();
  }

  @Get(':id/items')
  getItemsByOrder(@Param('id') id: number) {
    return this.orderService.getItemsByOrderId(id);
  }

  @Get('state/:state')
  findByState(@Param('state') state: string) {
    return this.orderService.findOrdersByState(state);
  }

  @Get(':id/detail')
  getOrderDetail(@Param('id') id: number) {
    return this.orderService.getOrderWithItems(id);
  }

  @Post('assign/:orderId/:courierId')
  assignOrderToCourier(
    @Param('orderId') orderId: number,
    @Param('courierId') courierId: number,
  ) {
    return this.orderService.assignOrderToCourier(orderId, courierId);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.orderService.findOrderById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateOrderDto) {
    return this.orderService.updateOrder(id, dto);
  }

  @Patch(':orderId/items/update')
  updateItemQuantity(
    @Param('orderId') orderId: number,
    @Body() dto: UpdateOrderItemDto,
  ) {
    return this.orderService.updateOrderItemsQuantity(orderId, dto);
  }

  @Patch(':id/mark-delivered')
  markAsDelivered(@Param('id') id: number) {
    return this.orderService.updateOrder(id, { deliveryState: 'entregado' });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.orderService.deleteOrder(id);
  }

  @Delete(':orderId/items/:productId')
  deleteItem(
    @Param('orderId') orderId: number,
    @Param('productId') productId: number,
  ) {
    return this.orderService.deleteOrderItem(orderId, productId);
  }

  @Delete(':orderId/items')
  clearOrderItems(@Param('orderId') orderId: number) {
    return this.orderService.clearOrderItems(orderId);
  }
}
