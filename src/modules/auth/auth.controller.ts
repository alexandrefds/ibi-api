import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator.js';
import { CreateUserDto } from '../users/dtos/create-user.dto.js';
import { AuthService } from './auth.service.js';
import { AuthResponseDto } from './dtos/auth-response.dto.js';
import { LoginDto } from './dtos/login.dto.js';

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('register') register(
    @Body() dto: CreateUserDto,
  ): Promise<AuthResponseDto> {
    return this.auth.register(dto);
  }
  @Post('login') @HttpCode(HttpStatus.OK) login(
    @Body() dto: LoginDto,
  ): Promise<AuthResponseDto> {
    return this.auth.login(dto);
  }
}
