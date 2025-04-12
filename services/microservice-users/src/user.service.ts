import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async obtenerUno(): Promise<User> {
    return this.userRepo.findOne({ where: {} });
  }

  async obtenerTodos(): Promise<User[]> {
    return this.userRepo.find();
  }
}
