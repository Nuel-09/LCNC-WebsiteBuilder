import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    email: string;
  };
};

/**
 * Route guard that protects endpoints requiring authentication.
 * Reads Bearer token, verifies JWT, then attaches decoded user info to request.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Runs before controller handler.
   * Return true to allow request, otherwise throw UnauthorizedException.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      // Verify signature and expiration of token.
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token, {
        secret: this.configService.get<string>(
          'JWT_SECRET',
          'dev_super_secret_change_me',
        ),
      });

      // Attach authenticated identity to request for downstream handlers.
      request.user = {
        userId: payload.sub,
        email: payload.email,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
