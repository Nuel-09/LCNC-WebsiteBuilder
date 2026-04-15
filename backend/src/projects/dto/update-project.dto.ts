import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * DTO for updating an existing project.
 */
export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  projectName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  schoolType?: string;
}
