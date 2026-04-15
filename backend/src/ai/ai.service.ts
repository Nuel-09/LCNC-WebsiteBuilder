import { Inject, Injectable } from '@nestjs/common';
import { AI_PROVIDER } from './providers/ai-provider.interface';
import type {
  AiChatContext,
  AiProvider,
} from './providers/ai-provider.interface';

/**
 * Thin orchestration layer between controller and selected provider.
 *
 * Why this exists:
 * - keeps controller focused on transport concerns (HTTP in/out)
 * - keeps provider focused on vendor implementation details
 * - provides a stable place for cross-provider policies later (rate-limit, logging, tracing)
 */
@Injectable()
export class AiService {
  constructor(@Inject(AI_PROVIDER) private readonly provider: AiProvider) {}

  /**
   * Delegates chat handling to whichever provider is active in DI.
   */
  chat(request: Request, context: AiChatContext): Promise<Response> {
    return this.provider.chat(request, context);
  }
}
