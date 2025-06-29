import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/app.module';
import { OrderRepository } from './domain/repositories/order.repository';
import { OrderItemRepository } from './domain/repositories/order-item.repository';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const orderRepo = app.get(OrderRepository);
  const orderItemRepo = app.get(OrderItemRepository);
  const httpService = app.get(HttpService);
  const configService = app.get(ConfigService);

  const USER_SERVICE_URL = configService.get<string>('USER_SERVICE_URL');
  const PRODUCT_SERVICE_URL = configService.get<string>('PRODUCT_SERVICE_URL');

  const existingOrders = await orderRepo.findAll();
  if (existingOrders.length > 0) {
    console.log('Ya existen órdenes. Seeder omitido.');
    await app.close();
    return;
  }

  // Obtener usuario cliente
  const { data: users } = await firstValueFrom(
    httpService.get(`${USER_SERVICE_URL}/usuarios/all`),
  );
  const client = users.find((u) => u.email === 'comprador@vecinos.cl');
  if (!client) {
    console.error('Cliente comprador@vecinos.cl no encontrado.');
    await app.close();
    return;
  }

  // Obtener tiendas
  const { data: stores } = await firstValueFrom(
    httpService.get(`${USER_SERVICE_URL}/stores/all`),
  );
  const store = stores[0];
  if (!store) {
    console.error('No se encontró ninguna tienda.');
    await app.close();
    return;
  }

  // Obtener productos de esa tienda
  const { data: products } = await firstValueFrom(
    httpService.get(`${PRODUCT_SERVICE_URL}/products/store/${store.id}`),
  );
  if (products.length < 2) {
    console.error('Se requieren al menos 2 productos para crear las órdenes.');
    await app.close();
    return;
  }

  const [product1, product2] = products;

  // Crear orden 1: Retiro en tienda
  const order1 = await orderRepo.createOrder({
    storeId: store.id,
    clientId: client.id,
    courierId: null,
    deliveryType: 'retiro_en_tienda',
    deliveryState: 'pendiente',
    totalAmount: product1.price,
  });

  await orderItemRepo.addItems([
    {
      orderId: order1.id,
      productId: product1.productId,
      quantity: 1,
    },
  ]);

  console.log(`Orden 1 creada (retiro en tienda): ID ${order1.id}`);

  // Crear orden 2: Delivery pendiente
  const total2 = Number(product1.price) + Number(product2.price);
  const order2 = await orderRepo.createOrder({
    storeId: store.id,
    clientId: client.id,
    courierId: null,
    deliveryType: 'delivery',
    deliveryState: 'pendiente',
    totalAmount: total2,
  });

  await orderItemRepo.addItems([
    {
      orderId: order2.id,
      productId: product1.productId,
      quantity: 1,
    },
    {
      orderId: order2.id,
      productId: product2.productId,
      quantity: 1,
    },
  ]);

  console.log(`Orden 2 creada (delivery pendiente): ID ${order2.id}`);

  console.log('Seeder de órdenes completado.');
  await app.close();
}

bootstrap();
