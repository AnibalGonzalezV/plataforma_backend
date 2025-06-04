import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductService } from 'src/application/services/product.service';
import { CreateProductDto } from 'src/application/dtos/create-product.dto';
import { UpdateProductDto } from 'src/application/dtos/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get('store/:storeId')
  findByStoreId(@Param('storeId') storeId: number) {
    return this.productService.findByStoreId(storeId);
  }

  @Get('all')
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.productService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}
