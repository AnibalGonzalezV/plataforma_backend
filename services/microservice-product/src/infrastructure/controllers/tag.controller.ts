import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { TagService } from 'src/application/services/tag.service';
import { CreateTagDto } from 'src/application/dtos/create-tag.dto';
import { UpdateTagDto } from 'src/application/dtos/update-tag.dto';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('create')
  async createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagService.createTag(createTagDto);
  }

  @Get('all')
  async findAllTags() {
    return this.tagService.findAllTags();
  }

  @Get(':id')
  async findTagById(@Param('id') tagId: number) {
    return this.tagService.findTagById(tagId);
  }

  @Patch(':id')
  async updateTag(
    @Param('id') tagId: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.updateTag(tagId, updateTagDto);
  }

  @Delete(':id')
  async deleteTag(@Param('id') tagId: number) {
    return this.tagService.deleteTag(tagId);
  }
}
