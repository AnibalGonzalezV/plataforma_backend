import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  NotFoundException,
  Patch,
  Delete,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { StoreService } from '../../application/services/store.service';
import { CreateStoreDto } from 'src/application/dto/create-store.dto';
import { UpdateStoreDto } from 'src/application/dto/update-store.dto';
import * as jwt from 'jsonwebtoken';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('create')
  async createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }

  @Get('all')
  async findAllStores() {
    return this.storeService.findAllStores();
  }

  @Get(':id')
  async findStoreById(@Param('id') id: number) {
    const store = await this.storeService.findStoreById(id);
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  @Patch(':id')
  async updateStore(
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreDto,
    @Req() req: Request,
  ) {
    const userId = Number(req.headers['x-user-id']);
    if (!userId) {
      throw new UnauthorizedException('User ID not provided in headers');
    }

    try {
      return await this.storeService.updateStore(id, updateStoreDto, userId);
    } catch (error) {
      if (error.message.includes('Unauthorized')) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  removeStore(@Param('id') id: number) {
    return this.storeService.deleteStore(id);
  }
}
