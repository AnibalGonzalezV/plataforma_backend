import { DataSource, Repository } from 'typeorm';
import { Courier } from '../entities/courier.entity';

export class CourierRepository extends Repository<Courier> {
  constructor(private readonly dataSource: DataSource) {
    super(Courier, dataSource.createEntityManager());
  }

  async createCourier(courier: Partial<Courier>): Promise<Courier> {
    const newCourier = this.create(courier);
    return this.save(newCourier);
  }

  findAll(): Promise<Courier[]> {
    return this.find({ relations: ['user'] });
  }

  findById(id: number): Promise<Courier | null> {
    return this.findOne({ where: { id }, relations: ['user'] });
  }

  async updateCourier(id: number, data: Partial<Courier>): Promise<Courier> {
    const courier = await this.findById(id);
    if (!courier) {
      throw new Error('Courier not found');
    }
    Object.assign(courier, data);
    return this.save(courier);
  }

  async deleteCourier(id: number): Promise<void> {
    const courier = await this.findById(id);
    if (courier) {
      await this.remove(courier);
    }
  }
}
