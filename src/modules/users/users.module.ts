import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashPasswordAction } from './actions/hash-password.action.js';
import { User } from './entities/user.entity.js';
import { UserProfile } from './entities/user-profile.entity.js';
import { UserRepository } from './repositories/user.repository.js';
import { UserCreateService } from './services/user-create.service.js';
import { UsersService } from './services/users.service.js';
import { UsersController } from './users.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile])],
  controllers: [UsersController],
  providers: [
    UserRepository,
    HashPasswordAction,
    UserCreateService,
    UsersService,
  ],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
