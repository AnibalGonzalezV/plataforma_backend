import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from '../config/typeorm.config';
import { ProductModule } from './product.module';
import { CategoryModule } from './category.module';
import { TagModule } from './tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ProductModule,
    CategoryModule,
    TagModule,
  ],
})
export class AppModule {}
