import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MetricsController } from '../controllers/metrics.controller';
import { MetricsService } from '../../application/services/metrics.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
