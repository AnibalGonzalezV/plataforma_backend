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

  @Get('state-count')
  countOrdersByDeliveryState() {
    return this.orderService.countOrdersByDeliveryState();
  }
}
