import { Controller, Get } from '@nestjs/common';
import { MetricsService } from '../../application/services/metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('count-by-role')
  async getUsersCountByRole() {
    return this.metricsService.getUsersCountByRole();
  }
}
