import { Module } from '@nestjs/common';
import { OrderService } from 'src/application/services/order.service';
import { OrderController } from '../controllers/order.controller';
import { OrderRepository } from 'src/domain/repositories/order.repository';
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
  ],
})
export class OrderModule {}
