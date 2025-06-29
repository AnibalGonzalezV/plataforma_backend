import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from 'src/application/services/product.service';
import { CreateProductDto } from 'src/application/dtos/create-product.dto';
import { UpdateProductDto } from 'src/application/dtos/update-product.dto';
import { BulkCheckDto } from 'src/application/dtos/bulk-check.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get('store/:storeId')
  async findByStoreId(@Param('storeId') storeId: number) {
    return this.productService.findByStoreId(storeId);
  }

  @Get('all')
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.productService.findById(id);
  }

  @Get('category/:categoryId')
  async findByCateogoryId(@Param('categoryId') categoryId: number) {
    return this.productService.findByCategoryId(categoryId);
  }

  @Get('tag/:tagId')
  async findByTag(@Param('tagId') tagId: number) {
    return this.productService.findByTagId(Number(tagId));
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateProductDto,
    @Req() req: any,
  ) {
    const userId = Number(req.headers['x-user-id']);
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    try {
      return await this.productService.update(id, updateDto, userId);
    } catch (error) {
      if (error.message.includes('Unauthorized')) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post('bulk-check')
  async bulkCheck(@Body() dto: BulkCheckDto) {
    if (!Array.isArray(dto.productIds)) {
      throw new BadRequestException('productIds debe ser un arreglo');
    }
    return this.productService.bulkCheck(dto.productIds);
  }

  @Post('decrease-stock')
  async decreaseStock(
    @Body() items: { productId: number; quantity: number }[],
  ) {
    return this.productService.decreaseStock(items);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}
