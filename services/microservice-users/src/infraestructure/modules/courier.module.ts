import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourierController } from '../controllers/courier.controller';
import { CourierService } from '../../application/services/courier.service';
import { User } from 'src/domain/entities/user.entity';
import { DataSource } from 'typeorm';
import { Courier } from 'src/domain/entities/courier.entity';
import { CourierRepository } from 'src/domain/repositories/courier.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Courier, User])],
  controllers: [CourierController],
  providers: [
    CourierService,
    {
      provide: CourierRepository,
      useFactory: (dataSource: DataSource) => new CourierRepository(dataSource),
      inject: [DataSource],
    },
  ],
})
export class CourierModule {}
