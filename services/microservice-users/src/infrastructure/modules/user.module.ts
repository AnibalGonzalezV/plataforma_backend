// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserService } from '../../application/services/user.service';
import { RoleModule } from './role.module';
import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../../domain/repositories/user.repository';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) => new UserRepository(dataSource),
      inject: [DataSource],
    },
  ],
})
export class UserModule {}
