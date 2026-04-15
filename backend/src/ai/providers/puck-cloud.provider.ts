import {
  Injectable,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AiChatContext } from './ai-provider.interface';
import { AiProvider } from './ai-provider.interface';

/**
 * Concrete AI provider backed by Puck Cloud.
 *
 * Responsibilities:
 * - read runtime AI settings from environment
 * - enrich prompt context with authenticated app context
 * - delegate streaming/chat behavior to puckHandler
 * - normalize upstream failures into Nest HTTP exceptions
 */
@Injectable()
export class PuckCloudProvider implements AiProvider {
  constructor(private readonly configService: ConfigService) {}

  /**
   * @puckeditor/cloud-client is ESM-only. Nest runs this backend in a CJS runtime,
   * so we load the module lazily with dynamic import to avoid ERR_PACKAGE_PATH_NOT_EXPORTED
   * during app bootstrap.
   */
  private async getPuckHandler() {
    const cloudClient = await import('@puckeditor/cloud-client');
    return cloudClient.puckHandler;
  }

  /**
   * Sends the request to Puck Cloud and returns a Web Response.
   * The returned payload may be streamed and is forwarded by ai.controller.ts.
   */
  async chat(request: Request, context: AiChatContext): Promise<Response> {
    const apiKey = this.configService.get<string>('PUCK_API_KEY');

    if (!apiKey) {
      throw new ServiceUnavailableException(
        'AI is not configured. Set PUCK_API_KEY in backend .env.',
      );
    }

    const host = this.configService.get<string>('PUCK_AI_HOST');
    const baseContext = this.configService.get<string>(
      'PUCK_AI_CONTEXT',
      'You are helping a school-site content editor produce clear, accurate page content.',
    );

    // Append runtime identity hints so responses stay scoped to the active user/project.
    const runtimeContext = `${baseContext}\nUser ID: ${context.userId}${
      context.projectId ? `\nProject ID: ${context.projectId}` : ''
    }`;

    try {
      const puckHandler = await this.getPuckHandler();

      return await puckHandler(request, {
        apiKey,
        host,
        ai: {
          context: runtimeContext,
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown AI provider error';
      throw new InternalServerErrorException(`AI request failed: ${message}`);
    }
  }
}
