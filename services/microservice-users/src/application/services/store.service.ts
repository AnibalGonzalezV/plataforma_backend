import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
      imageUrl: createStoreDto.imageUrl,
      owner: { id: createStoreDto.userId } as User,
    };
    return this.storeRepository.createStore(store);
  }

  async findAllStores(): Promise<any[]> {
    const stores = await this.storeRepository.findAll();
    return stores.map((store) => ({
      id: store.id,
      name: store.name,
      address: store.address,
      imageUrl: store.imageUrl,
      score: store.score,
      owner: {
        id: store.owner.id,
        email: store.owner.email,
        names: store.owner.names,
        lastNames: store.owner.lastNames,
        phoneNumber: store.owner.phoneNumber,
      },
    }));
  }

  async findStoreById(id: number): Promise<any> {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new Error(`Store with ID ${id} not found`);
    }
    return {
      id: store.id,
      name: store.name,
      address: store.address,
      imageUrl: store.imageUrl,
      score: store.score,
      owner: {
        id: store.owner.id,
        email: store.owner.email,
        names: store.owner.names,
        lastNames: store.owner.lastNames,
        phoneNumber: store.owner.phoneNumber,
      },
    };
  }

  async updateStore(
    id: number,
    updateStoreDto: UpdateStoreDto,
    userId: number,
  ): Promise<Store> {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    if (store.owner.id !== userId) {
      throw new UnauthorizedException(
        `Unauthorized: You are not the owner of this store`,
      );
    }

    const updateStore = await this.storeRepository.updateStore(
      id,
      updateStoreDto,
    );
    if (!updateStore) {
      throw new Error(`Failed to update store`);
    }
    return updateStore;
  }

  async deleteStore(id: number): Promise<void> {
    await this.storeRepository.deleteStore(id);
  }
}
