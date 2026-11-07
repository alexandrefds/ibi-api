import { Injectable, NotFoundException } from '@nestjs/common';
import { HashPasswordAction } from '../actions/hash-password.action.js';
import { CreateUserDto } from '../dtos/create-user.dto.js';
import { UpdateUserDto } from '../dtos/update-user.dto.js';
import { UserResponseDto } from '../dtos/user-response.dto.js';
import { User } from '../entities/user.entity.js';
import { UserRepository } from '../repositories/user.repository.js';
import { UserCreateService } from './user-create.service.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUser: UserCreateService,
    private readonly users: UserRepository,
    private readonly hashPassword: HashPasswordAction,
  ) {}
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    return this.toResponse(await this.createUser.execute(dto));
  }
  async findOne(id: string): Promise<UserResponseDto> {
    return this.toResponse(await this.requireUser(id));
  }
  async findAll(): Promise<UserResponseDto[]> {
    return (await this.users.find({ relations: { profile: true } })).map(
      (user) => this.toResponse(user),
    );
  }
  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.requireUser(id);
    if (dto.password)
      user.password = await this.hashPassword.execute(dto.password);
    if (dto.role) user.role = dto.role;
    if (dto.firstName) user.profile.firstName = dto.firstName;
    if (dto.lastName) user.profile.lastName = dto.lastName;
    if (dto.phone !== undefined) user.profile.phone = dto.phone;
    if (dto.businessName !== undefined)
      user.profile.businessName = dto.businessName;
    return this.toResponse(await this.users.save(user));
  }
  async remove(id: string): Promise<void> {
    await this.requireUser(id);
    await this.users.softDelete(id);
  }
  async findForAuthentication(email: string): Promise<User | null> {
    return this.users.findByEmail(email, true);
  }
  private async requireUser(id: string): Promise<User> {
    const user = await this.users.findByIdWithProfile(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  private toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      phone: user.profile.phone,
      businessName: user.profile.businessName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
