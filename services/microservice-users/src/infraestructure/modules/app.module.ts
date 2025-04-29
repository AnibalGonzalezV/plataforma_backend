import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from '../config/typeorm.config';

import { UserModule } from './user.module';
import { CourierModule } from './courier.module';
import { RoleModule } from './role.module';
import { StoreModule } from './store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Para que no tengas que importar ConfigModule en cada módulo
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    CourierModule,
    RoleModule,
    StoreModule,
  ],
})
export class AppModule {}
