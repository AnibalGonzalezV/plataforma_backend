import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  NotFoundException,
  Patch,
  Delete,
} from '@nestjs/common';
import { StoreService } from '../../application/services/store.service';
import { CreateStoreDto } from 'src/application/dto/create-store.dto';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('create')
  createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }

  @Get('all')
  findAllStores() {
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
  updateStore(@Param('id') id: number, @Body() updateStoreDto: any) {
    return this.storeService.updateStore(id, updateStoreDto);
  }

  @Delete(':id')
  removeStore(@Param('id') id: number) {
    return this.storeService.deleteStore(id);
  }
}
