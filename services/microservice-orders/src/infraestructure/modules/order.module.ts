import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/domain/entities/order.entity';
import { OrderService } from 'src/application/services/order.service';
import { OrderController } from '../controllers/order.controller';
import { OrderRepository } from 'src/domain/repositories/order.repository';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useFactory: (dataSource: DataSource) => new OrderRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
