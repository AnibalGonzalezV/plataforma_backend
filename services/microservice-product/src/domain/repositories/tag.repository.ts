import { DataSource, Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';

export class TagRepository extends Repository<Tag> {
  constructor(private readonly dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }

  async createTag(data: Partial<Tag>): Promise<Tag> {
    const tag = this.create(data);
    return await this.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return await this.find();
  }

  async findByName(name: string): Promise<Tag | null> {
    return await this.findOne({ where: { name } });
  }

  async findById(tagId: number): Promise<Tag | null> {
    return await this.findOne({ where: { tagId } });
  }

  async updateTag(tagId: number, data: Partial<Tag>): Promise<Tag | null> {
    await this.update(tagId, data);
    return this.findById(tagId);
  }

  async deleteTag(tagId: number): Promise<void> {
    await this.delete(tagId);
  }
}
