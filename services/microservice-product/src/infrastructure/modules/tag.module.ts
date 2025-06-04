import { Module } from '@nestjs/common';
import { TagService } from 'src/application/services/tag.service';
import { TagController } from '../controllers/tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/domain/entities/tag.entity';
import { DataSource } from 'typeorm';
import { TagRepository } from 'src/domain/repositories/tag.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [
    TagService,
    {
      provide: TagRepository,
      useFactory: (dataSource: DataSource) => new TagRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [TagService],
})
export class TagModule {}
