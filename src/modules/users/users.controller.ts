import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { UserRole } from '../../common/enums/user-role.enum.js';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { UserResponseDto } from './dtos/user-response.dto.js';
import { UsersService } from './services/users.service.js';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}
  @Get() @Roles(UserRole.ADMIN, UserRole.STORE) findAll(): Promise<
    UserResponseDto[]
  > {
    return this.users.findAll();
  }
  @Get(':id') findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.users.findOne(id);
  }
  @Patch(':id') update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.users.update(id, dto);
  }
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.users.remove(id);
  }
  @Post() @Roles(UserRole.ADMIN) create(
    @Body() dto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.users.create(dto);
  }
}
