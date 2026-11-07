import { UserRole } from '../../../common/enums/user-role.enum.js';

export class UserResponseDto {
  id!: string;
  email!: string;
  role!: UserRole;
  isVerified!: boolean;
  firstName!: string;
  lastName!: string;
  phone!: string | null;
  businessName!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
