import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CourierService } from '../../application/services/courier.service';
import { CreateCourierDto } from '../../application/dto/create-courier.dto';
import { UpdateCourierDto } from '../../application/dto/update-courier.dto';

@Controller('couriers')
export class CourierController {
  constructor(private readonly courierService: CourierService) {}

  @Post('create')
  async create(@Body() createCourierDto: CreateCourierDto) {
    return this.courierService.create(createCourierDto);
  }

  @Get('all')
  async findAll() {
    return this.courierService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.courierService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCourierDto: UpdateCourierDto,
  ) {
    return this.courierService.update(+id, updateCourierDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.courierService.remove(+id);
  }
}
