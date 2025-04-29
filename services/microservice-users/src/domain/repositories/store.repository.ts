import { DataSource, Repository } from 'typeorm';
import { Store } from '../entities/store.entity';

export class StoreRepository extends Repository<Store> {
  constructor(private dataSource: DataSource) {
    super(Store, dataSource.createEntityManager());
  }
  async findById(id: number): Promise<Store | null> {
    return this.findOne({ where: { id } });
  }

  async findAll(): Promise<Store[]> {
    return this.find({ relations: ['owner'] });
  }

  async createStore(store: Partial<Store>): Promise<Store> {
    const newStore = this.create(store);
    return this.save(newStore);
  }

  async updateStore(id: number, store: Partial<Store>): Promise<Store | null> {
    await this.update(id, store);
    return this.findById(id);
  }

  async deleteStore(id: number): Promise<void> {
    await this.delete(id);
  }
}
