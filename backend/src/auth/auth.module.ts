import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * Auth module:
 * - exposes signup/login endpoints
 * - signs JWT tokens
 * - exports JwtModule so other modules can verify tokens
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Use values from .env.
        secret: configService.get<string>('JWT_SECRET', 'dev_super_secret_change_me'),
        signOptions: {
          expiresIn: Number(
            configService.get<string>('JWT_EXPIRES_IN_SECONDS', '86400'),
          ),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
