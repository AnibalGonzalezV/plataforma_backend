import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../domain/entities/role.entity';
import { RoleService } from '../../application/services/role.service';
import { RoleController } from '../controllers/role.controller';
import { RoleRepository } from '../../domain/repositories/role.repository';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [
    RoleService,
    {
      provide: RoleRepository,
      useFactory: (dataSource: DataSource) => new RoleRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}
