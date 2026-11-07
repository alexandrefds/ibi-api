import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
@Index(['name'])
export class Product {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ length: 200 }) name!: string;
  @Column({ type: 'text', nullable: true }) description!: string | null;
  @Column({ type: 'integer' }) priceInCents!: number;
  @Column({ type: 'integer', default: 0 }) stock!: number;
  @Column({ length: 100, default: 'general' }) category!: string;
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
