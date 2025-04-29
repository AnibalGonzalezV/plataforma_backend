// src/courier/courier.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CourierRepository } from '../../domain/repositories/courier.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCourierDto } from '../dto/create-courier.dto';
import { UpdateCourierDto } from '../dto/update-courier.dto';

@Injectable()
export class CourierService {
  constructor(
    private readonly courierRepository: CourierRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateCourierDto) {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const courier = await this.courierRepository.createCourier({
      user,
      vehicleType: dto.vehicleType,
      available: dto.available ?? false, // Opcional: si no viene, por defecto
    });

    return courier;
  }

  findAll() {
    return this.courierRepository.findAll();
  }

  async findOne(id: number) {
    const courier = await this.courierRepository.findById(id);
    if (!courier) {
      throw new NotFoundException('Courier not found');
    }
    return courier;
  }

  async update(id: number, dto: UpdateCourierDto) {
    const courier = await this.findOne(id);
    return this.courierRepository.updateCourier(courier.id, dto);
  }

  async remove(id: number) {
    await this.findOne(id); // Lanza error si no existe
    await this.courierRepository.deleteCourier(id);
  }
}
