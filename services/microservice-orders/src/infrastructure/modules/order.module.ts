import { Module } from '@nestjs/common';
import { OrderService } from 'src/application/services/order.service';
import { OrderController } from '../controllers/order.controller';
import { OrderRepository } from 'src/domain/repositories/order.repository';
import { OrderItemRepository } from 'src/domain/repositories/order-item.repository';
import { DataSource } from 'typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useFactory: (dataSource: DataSource) => new OrderRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: OrderItemRepository,
      useFactory: (dataSource: DataSource) =>
        new OrderItemRepository(dataSource),
      inject: [DataSource],
    },
  ],
})
export class OrderModule {}
