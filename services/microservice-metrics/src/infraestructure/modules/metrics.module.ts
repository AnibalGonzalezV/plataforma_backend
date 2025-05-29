import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MetricsController } from '../controllers/metrics.controller';
import { MetricsService } from '../../application/services/metrics.service';

@Module({
  imports: [HttpModule],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
