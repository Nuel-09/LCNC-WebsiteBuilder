import {
  Body,
  Controller,
  Get,
  Headers as HeaderParams,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';

type AuthenticatedRequest = ExpressRequest & {
  user: {
    userId: string;
    email: string;
  };
};

/**
 * HTTP boundary for AI requests from the Builder UI.
 *
 * Data role:
 * - validates authentication via JwtAuthGuard
 * - converts Express request primitives into Web Request for provider SDK
 * - forwards upstream AI response back to the browser
 */
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * GET /ai/chat
   *
   * Browser address-bar visits are GET by default.
   * The plugin uses POST, so this endpoint provides a clear hint instead of a Not Found message.
   */
  @Get('chat')
  getChatHelp() {
    return {
      ok: true,
      message:
        'AI chat endpoint is reachable. Use POST /ai/chat for chat requests.',
    };
  }

  /**
   * POST /ai/chat
   *
   * Expected caller: frontend Puck AI plugin.
   * Request body: plugin-generated chat payload plus our injected projectId.
   */
  @Post('chat')
  async chat(
    @Req() request: AuthenticatedRequest,
    @Res() response: ExpressResponse,
    @Body() body: unknown,
    @HeaderParams()
    headers: Record<string, string | string[] | undefined>,
  ) {
    // Rehydrate incoming headers into Web Headers for compatibility with puckHandler.
    const webHeaders = new globalThis.Headers();
    for (const [name, value] of Object.entries(headers)) {
      if (Array.isArray(value)) {
        webHeaders.set(name, value.join(','));
      } else if (typeof value === 'string') {
        webHeaders.set(name, value);
      }
    }

    if (!webHeaders.has('content-type')) {
      webHeaders.set('content-type', 'application/json');
    }

    // Convert incoming Express payload into a Web Request consumed by provider SDK.
    // puckHandler has an internal route registry keyed by "/api/puck/chat".
    // We keep external app route as "/ai/chat" and map it here for the SDK.
    const webRequest = new Request('http://localhost/api/puck/chat', {
      method: 'POST',
      headers: webHeaders,
      body: JSON.stringify(body ?? {}),
    });

    const aiResponse = await this.aiService.chat(webRequest, {
      userId: request.user.userId,
      projectId:
        typeof body === 'object' && body !== null && 'projectId' in body
          ? String((body as { projectId?: unknown }).projectId ?? '')
          : undefined,
      totalPages:
        typeof body === 'object' &&
        body !== null &&
        'pageContext' in body &&
        Array.isArray(
          (body as { pageContext?: { pages?: unknown[] } }).pageContext?.pages,
        )
          ? (body as { pageContext?: { pages?: unknown[] } }).pageContext?.pages
              ?.length
          : undefined,
      activePageId:
        typeof body === 'object' &&
        body !== null &&
        'pageContext' in body &&
        typeof (
          body as {
            pageContext?: { activePageId?: unknown };
          }
        ).pageContext?.activePageId === 'string'
          ? String(
              (
                body as {
                  pageContext?: { activePageId?: unknown };
                }
              ).pageContext?.activePageId,
            )
          : undefined,
      activePageTitle:
        typeof body === 'object' &&
        body !== null &&
        'pageContext' in body &&
        typeof (
          body as {
            pageContext?: { activePageTitle?: unknown };
          }
        ).pageContext?.activePageTitle === 'string'
          ? String(
              (
                body as {
                  pageContext?: { activePageTitle?: unknown };
                }
              ).pageContext?.activePageTitle,
            )
          : undefined,
      pageSlugs:
        typeof body === 'object' &&
        body !== null &&
        'pageContext' in body &&
        Array.isArray(
          (body as { pageContext?: { pages?: unknown[] } }).pageContext?.pages,
        )
          ? (
              (
                body as {
                  pageContext?: {
                    pages?: Array<{ slug?: unknown }>;
                  };
                }
              ).pageContext?.pages ?? []
            )
              .map((page) => (typeof page.slug === 'string' ? page.slug : null))
              .filter((slug): slug is string => Boolean(slug))
          : undefined,
    });

    // Mirror upstream status/headers/body to client while skipping hop-by-hop headers.
    response.status(aiResponse.status);
    aiResponse.headers.forEach((value, name) => {
      if (
        name.toLowerCase() !== 'transfer-encoding' &&
        name.toLowerCase() !== 'content-encoding'
      ) {
        response.setHeader(name, value);
      }
    });

    const payload = Buffer.from(await aiResponse.arrayBuffer());
    response.send(payload);
  }
}
