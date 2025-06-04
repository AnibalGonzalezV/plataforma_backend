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

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.orderService.deleteOrder(id);
  }
}
