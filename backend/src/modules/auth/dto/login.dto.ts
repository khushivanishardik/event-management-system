// Location: backend/src/modules/auth/dto/login.dto.ts
// Purpose: Data Transfer Object for POST /auth/login.
//          Validates that email is a valid email string and password is present.

import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
