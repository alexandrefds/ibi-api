import { ConflictException, Injectable } from '@nestjs/common';
import { HashPasswordAction } from '../actions/hash-password.action.js';
import { CreateUserDto } from '../dtos/create-user.dto.js';
import { User } from '../entities/user.entity.js';
import { UserProfile } from '../entities/user-profile.entity.js';
import { UserRepository } from '../repositories/user.repository.js';

@Injectable()
export class UserCreateService {
  constructor(
    private readonly users: UserRepository,
    private readonly hashPassword: HashPasswordAction,
  ) {}
  async execute(dto: CreateUserDto): Promise<User> {
    if (await this.users.findByEmail(dto.email))
      throw new ConflictException('Email already registered');
    const profile = Object.assign(new UserProfile(), {
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone ?? null,
      businessName: dto.businessName ?? null,
    });
    return this.users.save(
      this.users.create({
        email: dto.email,
        password: await this.hashPassword.execute(dto.password),
        role: dto.role,
        profile,
      }),
    );
  }
}
