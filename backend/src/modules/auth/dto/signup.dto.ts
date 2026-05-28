// Location: backend/src/modules/auth/dto/signup.dto.ts
// Purpose: Data Transfer Object for POST /auth/signup.
//          Validates name, email, password strength, and optional role.

import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../../common/constants/roles.constant';

export class SignupDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be user or organizer' })
  role?: Role;

  @IsOptional()
  @IsString()
  phone?: string;
}
