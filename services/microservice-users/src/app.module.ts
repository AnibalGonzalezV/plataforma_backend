// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user.module';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'minombre2',
      database: 'proyecto_web_movil',
      entities: [User],
      synchronize: false,
    }),
    UserModule,
  ],
})
export class AppModule {}
