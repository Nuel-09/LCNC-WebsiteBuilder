import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  const jwtService = {
    verifyAsync: jest.fn(),
  } as unknown as JwtService;

  const configService = {
    get: jest.fn(() => 'test-secret'),
  } as unknown as ConfigService;

  const guard = new JwtAuthGuard(jwtService, configService);

  const buildContext = (authorization?: string): ExecutionContext => {
    const request: any = {
      headers: {},
    };

    if (authorization !== undefined) {
      request.headers.authorization = authorization;
    }

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when authorization header is missing', async () => {
    await expect(guard.canActivate(buildContext())).rejects.toThrow(
      new UnauthorizedException('Authorization header is required'),
    );
  });

  it('throws on invalid bearer format', async () => {
    await expect(guard.canActivate(buildContext('Token abc'))).rejects.toThrow(
      new UnauthorizedException('Invalid authorization format'),
    );
  });

  it('attaches user info for valid token', async () => {
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue({
      sub: 'user-123',
      email: 'test@example.com',
    });

    const context = buildContext('Bearer valid-token');
    const request = context.switchToHttp().getRequest();

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual({
      userId: 'user-123',
      email: 'test@example.com',
    });
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
      secret: 'test-secret',
    });
  });

  it('throws when token verification fails', async () => {
    (jwtService.verifyAsync as jest.Mock).mockRejectedValue(
      new Error('bad token'),
    );

    await expect(
      guard.canActivate(buildContext('Bearer invalid-token')),
    ).rejects.toThrow(new UnauthorizedException('Invalid or expired token'));
  });
});
