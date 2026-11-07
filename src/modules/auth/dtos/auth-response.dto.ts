import { UserResponseDto } from '../../users/dtos/user-response.dto.js';
export class AuthResponseDto {
  accessToken!: string;
  user!: UserResponseDto;
}
