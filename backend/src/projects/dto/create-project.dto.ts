import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * DTO for creating a new project.
 */
export class CreateProjectDto {
  // Project display name shown in user dashboard.
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  projectName: string;

  // Optional category for project specialization (e.g., primary/secondary).
  @IsOptional()
  @IsString()
  @MaxLength(50)
  schoolType?: string;
}
