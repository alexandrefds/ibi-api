import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dtos/create-user.dto.js';
import { AuthResponseDto } from './dtos/auth-response.dto.js';
import { LoginDto } from './dtos/login.dto.js';
import { UsersService } from '../users/services/users.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}
  async register(dto: CreateUserDto): Promise<AuthResponseDto> {
    const user = await this.users.create(dto);
    return {
      user,
      accessToken: await this.token(user.id, user.email, user.role),
    };
  }
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.users.findForAuthentication(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password)))
      throw new UnauthorizedException('Invalid credentials');
    const response = await this.users.findOne(user.id);
    return {
      user: response,
      accessToken: await this.token(response.id, response.email, response.role),
    };
  }
  private token(sub: string, email: string, role: string): Promise<string> {
    return this.jwt.signAsync({ sub, email, role });
  }
}
