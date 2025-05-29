import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto } from '../../application/dto/create-user.dto';

@Controller('usuarios')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('create')
  create(@Body() dto: CreateUserDto) {
    console.log('AQUI ENTRANDO AL CONTROLADOR');
    return this.usersService.create(dto);
  }

  @Patch(':id/roles')
  async assingRoles(
    @Param('id') id: number,
    @Body() dto: { roleIds: number[] },
  ) {
    return this.usersService.assingRoles(id, dto.roleIds);
  }

  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id/roles')
  async getUserRoles(@Param('id') id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user.roles;
  }

  @Get('by-email/:email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  @Get('count-by-role')
  async getUsersCountByRole() {
    return this.usersService.getUsersCountByRole();
  }
}
