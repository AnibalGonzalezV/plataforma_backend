import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Role } from '../entities/role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  names: string;

  @Column({ name: 'last_names' })
  lastNames: string;

  @Column()
  address: string;

  @Column({ name: 'phone_number' })
  phoneNumber: number;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'registration_date' })
  registrationDate: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'user_id', // nombre en la tabla intermedia
      referencedColumnName: 'id', // propiedad en User
    },
    inverseJoinColumn: {
      name: 'role_id', // nombre en la tabla intermedia
      referencedColumnName: 'id', // propiedad en Role
    },
  })
  roles: Role[];
}
