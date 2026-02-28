import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO for user signup requests.
 * Nest uses this class with ValidationPipe to validate request body.
 */
export class SignupDto {
  // Must be a valid email format.
  @IsEmail()
  email: string;

  // Minimum password length for basic validation.
  @IsString()
  @MinLength(6)
  password: string;

  // Optional profile field.
  @IsOptional()
  @IsString()
  fullName?: string;

  // Optional profile field.
  @IsOptional()
  @IsString()
  schoolName?: string;
}
