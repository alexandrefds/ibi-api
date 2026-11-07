import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  findByEmail(email: string, withPassword = false): Promise<User | null> {
    const query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('LOWER(user.email) = LOWER(:email)', { email });
    if (withPassword) query.addSelect('user.password');
    return query.getOne();
  }
  findByIdWithProfile(id: string): Promise<User | null> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id = :id', { id })
      .getOne();
  }
}
