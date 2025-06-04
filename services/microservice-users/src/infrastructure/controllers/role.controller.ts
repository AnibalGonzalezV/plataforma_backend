import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RoleService } from '../../application/services/role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  create(@Body('name') name: string) {
    return this.roleService.create(name);
  }

  @Get('all')
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.roleService.findById(id);
  }
}
