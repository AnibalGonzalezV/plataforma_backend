import { NestFactory } from '@nestjs/core';
import { MetricsModule } from './infrastructure/modules/metrics.module';

async function bootstrap() {
  const app = await NestFactory.create(MetricsModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3004);
}
bootstrap();
