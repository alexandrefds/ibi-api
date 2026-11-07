import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { UserRole } from '../../../common/enums/user-role.enum.js';
import { UserProfile } from './user-profile.entity.js';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['role'])
export class User {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ length: 255, unique: true }) email!: string;
  @Column({ select: false }) password!: string;
  @Column({ type: 'varchar', length: 20, default: UserRole.BUYER })
  role!: UserRole;
  @Column({ default: false }) isVerified!: boolean;
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt!: Date | null;
  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile!: Relation<UserProfile>;
  @BeforeInsert() @BeforeUpdate() normalizeEmail(): void {
    this.email = this.email.toLowerCase().trim();
  }
}
