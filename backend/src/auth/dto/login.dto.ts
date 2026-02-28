import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO for login requests.
 */
export class LoginDto {
  // User login identifier.
  @IsEmail()
  email: string;

  // Basic password format check.
  @IsString()
  @MinLength(6)
  password: string;
}
