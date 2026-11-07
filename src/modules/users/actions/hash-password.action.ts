import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordAction {
  async execute(password: string): Promise<string> {
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password))
      throw new BadRequestException(
        'Password must include upper, lower, number and special character',
      );
    return bcrypt.hash(password, 12);
  }
}
