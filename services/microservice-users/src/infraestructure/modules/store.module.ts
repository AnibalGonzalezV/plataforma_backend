import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../../domain/entities/store.entity';
import { StoreService } from '../../application/services/store.service';
import { StoreController } from '../controllers/store.controller';
import { StoreRepository } from '../../domain/repositories/store.repository';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [StoreController],
  providers: [
    StoreService,
    {
      provide: StoreRepository,
      useFactory: (dataSource: DataSource) => new StoreRepository(dataSource),
      inject: [DataSource],
    },
  ],
})
export class StoreModule {}
