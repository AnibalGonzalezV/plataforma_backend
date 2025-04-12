import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('usuarios')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async obtener() {
    return this.userService.obtenerUno();
  }

  @Get('all')
  async obtenerTodos() {
    return this.userService.obtenerTodos();
  }
}
