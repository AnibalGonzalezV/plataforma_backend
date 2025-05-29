import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ where: { email } });
  }

  async findAllActiveUsers(): Promise<User[]> {
    return this.find({ where: { isActive: true } });
  }
  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.create(user);
    return this.save(newUser);
  }

  async findById(id: number): Promise<User | null> {
    return this.findOne({ where: { id }, relations: ['roles'] });
  }

  async saveUser(user: User): Promise<User> {
    return this.save(user);
  }

  async countUsersByRole(): Promise<{ role: string; count: number }[]> {
    return this.createQueryBuilder('user')
      .leftJoin('user.roles', 'role')
      .select('role.name', 'role')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('role.name')
      .getRawMany();
  }
}
