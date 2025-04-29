import { Injectable } from '@nestjs/common';
import { StoreRepository } from 'src/domain/repositories/store.repository';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { Store } from 'src/domain/entities/store.entity';
import { User } from 'src/domain/entities/user.entity';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = {
      name: createStoreDto.name,
      address: createStoreDto.address,
      score: createStoreDto.score,
      owner: { id: createStoreDto.userId } as User,
    };
    return this.storeRepository.createStore(store);
  }

  async findAllStores(): Promise<Store[]> {
    return this.storeRepository.findAll();
  }

  async findStoreById(id: number): Promise<Store> {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new Error(`Store with ID ${id} not found`);
    }
    return store;
  }

  async updateStore(
    id: number,
    updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    const updatedStore = await this.storeRepository.updateStore(
      id,
      updateStoreDto,
    );
    if (!updatedStore) {
      throw new Error(`Store with ID ${id} not found`);
    }
    return updatedStore;
  }

  async deleteStore(id: number): Promise<void> {
    await this.storeRepository.deleteStore(id);
  }
}
