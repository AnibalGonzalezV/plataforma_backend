// src/user/user.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { RoleService } from './role.service';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleService: RoleService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const defaultRole = await this.roleService.findByName('comprador');
    const user = this.userRepo.createUser({
      ...dto,
      password: hashedPassword,
      isActive: true,
      registrationDate: new Date(),
      roles: [defaultRole],
    });
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.findAllActiveUsers();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async assingRoles(userId: number, roleIds: number[]): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const roles = await this.roleService.findManyById(roleIds);
    if (roles.length === 0) throw new NotFoundException('Roles no encontrados');

    user.roles = roles;
    return await this.userRepo.save(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async getUsersCountByRole(): Promise<{ role: string; count: number }[]> {
    return await this.userRepo.countUsersByRole();
  }
}
