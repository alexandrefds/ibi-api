import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from './user.entity.js';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ length: 100 }) firstName!: string;
  @Column({ length: 100 }) lastName!: string;
  @Column({ type: 'varchar', length: 30, nullable: true }) phone!:
    string | null;
  @Column({ type: 'varchar', length: 100, nullable: true })
  businessName!: string | null;
  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: Relation<User>;
}
