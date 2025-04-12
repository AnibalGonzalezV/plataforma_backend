import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
