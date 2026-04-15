import { Transform } from 'class-transformer';
import { IsObject } from 'class-validator';

/**
 * DTO used when saving builder state.
 * The frontend sends the full page-builder configuration as JSON.
 */
export class UpsertConfigurationDto {
  /**
   * Accept either object payloads or stringified JSON sent by older clients.
   */
  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  @IsObject()
  configJson: Record<string, unknown>;
}
