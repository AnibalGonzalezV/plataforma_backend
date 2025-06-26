import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  Patch,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { ChangePasswordDto } from 'src/application/dto/change-password.dto';

@Controller('usuarios')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('create')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id/roles')
  async assingRoles(
    @Param('id') id: number,
    @Body() dto: { roleIds: number[] },
  ) {
    return this.usersService.assingRoles(id, dto.roleIds);
  }

  @Patch('change-password')
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const userId = parseInt(req.headers['x-user-id'] as string);

    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    return this.usersService.changePassword(
      userId,
      dto.oldPassword,
      dto.newPassword,
    );
  }

  @Patch(':id/disable')
  async disableUser(@Param('id') id: number) {
    return this.usersService.setActiveStatus(+id, false);
  }

  @Patch(':id/enable')
  async enableUser(@Param('id') id: number) {
    return this.usersService.setActiveStatus(+id, true);
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
