import { Injectable } from '@nestjs/common';
import { TagRepository } from 'src/domain/repositories/tag.repository';
import { Tag } from 'src/domain/entities/tag.entity';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { UpdateTagDto } from '../dtos/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagRepository.createTag(createTagDto);
  }

  async findAllTags(): Promise<Tag[]> {
    return this.tagRepository.findAll();
  }

  async findTagById(tagId: number): Promise<Tag | null> {
    return this.tagRepository.findById(tagId);
  }

  async updateTag(
    tagId: number,
    updateTagDto: UpdateTagDto,
  ): Promise<Tag | null> {
    return this.tagRepository.updateTag(tagId, updateTagDto);
  }

  async deleteTag(tagId: number): Promise<void> {
    return this.tagRepository.deleteTag(tagId);
  }
}
