import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CategoryService } from 'src/application/services/category.service';
import { CreateCategoryDto } from 'src/application/dtos/create-category.dto';
import { UpdateCategoryDto } from 'src/application/dtos/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.categoryService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.categoryService.delete(id);
  }

  @Get(':id/with-store')
  getCategoryWithStore(@Param('id') id: number) {
    return this.categoryService.getCategoryWithStore(id);
  }
}
