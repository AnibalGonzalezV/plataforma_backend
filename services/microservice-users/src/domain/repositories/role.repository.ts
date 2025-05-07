// src/domain/repositories/role.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

export class RoleRepository extends Repository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async findByName(name: string): Promise<Role | undefined> {
    return this.findOne({ where: { name } });
  }

  async findAllRoles(): Promise<Role[]> {
    return this.find({
      loadRelationIds: true, // evita cargar recursivamente los usuarios
    });
  }

  async createRole(role: Partial<Role>): Promise<Role> {
    const newRole = this.create(role);
    return this.save(newRole);
  }
}
