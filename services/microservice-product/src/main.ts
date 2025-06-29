import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Aquí agregas el ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no definidas en DTO
      forbidNonWhitelisted: true, // lanza error si hay props extras
      transform: true, // transforma tipos automáticamente (ej: string a number)
    }),
  );

  await app.listen(3006);
}
bootstrap();
