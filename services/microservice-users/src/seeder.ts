import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/app.module';
import { RoleRepository } from './domain/repositories/role.repository';
import { UserRepository } from './domain/repositories/user.repository';
import { StoreRepository } from './domain/repositories/store.repository';
import { CourierRepository } from './domain/repositories/courier.repository';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const roleRepo = app.get(RoleRepository);
  const userRepo = app.get(UserRepository);
  const storeRepo = app.get(StoreRepository);
  const courierRepo = app.get(CourierRepository);

  console.log('Cargando roles...');
  const roleNames = ['administrador', 'comprador', 'vendedor', 'repartidor']; //administrador, comprador, vendedor, repartidor
  const roleMap: Record<string, any> = {};

  for (const name of roleNames) {
    let role = await roleRepo.findByName(name);
    if (!role) {
      role = await roleRepo.createRole({ name });
      console.log(`Rol creado: ${name}`);
    }
    roleMap[name] = role;
  }

  console.log(' Creando usuarios si no existen...');
  const createUser = async (
    email: string,
    plainPassword: string,
    roleNames: string[],
    overrides: Partial<any> = {},
  ) => {
    const existing = await userRepo.findByEmail(email);
    if (existing) {
      console.log(`Usuario ya existe: ${email}`);
      return existing;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await userRepo.createUser({
      email,
      password: hashedPassword,
      names: overrides.names ?? 'Nombre',
      lastNames: overrides.lastNames ?? 'Apellido',
      address: overrides.address ?? 'Dirección default',
      phoneNumber: overrides.phoneNumber ?? 123456789,
      isActive: true,
      registrationDate: new Date(),
      roles: roleNames.map((r) => roleMap[r]),
    });

    console.log(` Usuario creado: ${email}`);
    return user;
  };

  const admin = await createUser('admin@vecinos.cl', 'admin123', ['admin'], {
    names: 'Admin',
    lastNames: 'Vecinal',
  });

  const locatario1 = await createUser(
    'locatario1@vecinos.cl',
    'loca123',
    ['locatario'],
    { names: 'Juan', lastNames: 'Mercado' },
  );

  const locatario2 = await createUser(
    'locatario2@vecinos.cl',
    'loca123',
    ['locatario'],
    { names: 'Ana', lastNames: 'Comercio' },
  );

  const comprador = await createUser(
    'comprador@vecinos.cl',
    'compra123',
    ['comprador'],
    { names: 'Carlos', lastNames: 'Cliente' },
  );

  const repartidor = await createUser(
    'repartidor@vecinos.cl',
    'reparto123',
    ['repartidor'],
    { names: 'Pedro', lastNames: 'Reparto' },
  );

  console.log(' Verificando existencia de tiendas...');
  const tryCreateStore = async (
    name: string,
    address: string,
    owner: any,
    score: number,
  ) => {
    const existingStore = await storeRepo.findOne({
      where: { owner: { id: owner.id } },
      relations: ['owner'],
    });

    if (!existingStore) {
      await storeRepo.createStore({
        name,
        address,
        owner,
        score,
      });
      console.log(` Tienda creada: ${name}`);
    } else {
      console.log(` Tienda ya existe para: ${owner.names}`);
    }
  };

  await tryCreateStore('Tienda Juan', 'Mercado 1', locatario1, 4.7);
  await tryCreateStore('Tienda Ana', 'Comercio 5', locatario2, 4.8);

  console.log(' Verificando existencia de courier...');
  const existingCourier = await courierRepo.findOne({
    where: { user: { id: repartidor.id } },
    relations: ['user'],
  });

  if (!existingCourier) {
    await courierRepo.createCourier({
      user: repartidor,
      vehicleType: 'bicicleta',
      available: true,
    });
    console.log(' Courier creado');
  } else {
    console.log('Courier ya existe');
  }

  console.log(' Seed completo');
  await app.close();
}

bootstrap();
