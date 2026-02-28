import { IsObject } from 'class-validator';

/**
 * DTO used when saving builder state.
 * The frontend sends the full page-builder configuration as JSON.
 */
export class UpsertConfigurationDto {
  @IsObject()
  configJson: Record<string, unknown>;
}
