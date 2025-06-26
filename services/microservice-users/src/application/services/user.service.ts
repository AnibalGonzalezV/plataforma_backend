// src/user/user.service.ts
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { RoleService } from './role.service';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../../domain/entities/user.entity';
import { Not } from 'typeorm';

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

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepo.findAllActiveUsers();
    return users.map(({ id, email, names, lastNames, roles }) => ({
      id,
      email,
      names,
      lastNames,
      roles,
    }));
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

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tu cuenta está inactiva');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('La contraseña actual es incorrecta');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepo.save(user);

    return { message: 'Contraseña actualizada correctamente' };
  }

  async setActiveStatus(
    id: number,
    isActive: boolean,
  ): Promise<{ message: string }> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.isActive = isActive;
    await this.userRepo.save(user);

    return {
      message: `Usuario ${isActive ? 'habilitado' : 'deshabilitado'} correctamente`,
    };
  }
}
