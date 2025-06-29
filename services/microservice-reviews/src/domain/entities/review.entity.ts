import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryColumn()
  order_id: number;

  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'numeric', precision: 2, scale: 1 })
  score: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registration_date: Date;
}
