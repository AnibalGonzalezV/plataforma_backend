// src/role/role.service.ts
import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../../domain/repositories/role.repository';
import { Role } from '../../domain/entities/role.entity';
import { In } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepository) {}

  async findByName(name: string): Promise<Role> {
    const role = await this.roleRepo.findOneBy({ name });
    if (!role) {
      throw new Error(`Role with name ${name} not found`);
    }
    return role;
  }

  async create(name: string): Promise<Role> {
    const role = this.roleRepo.create({ name });
    return await this.roleRepo.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepo.findAllRoles();
  }

  async findById(id: number): Promise<Role> {
    return await this.roleRepo.findOneBy({ id });
  }

  async findManyById(ids: number[]): Promise<Role[]> {
    return await this.roleRepo.findBy({ id: In(ids) });
  }
}
