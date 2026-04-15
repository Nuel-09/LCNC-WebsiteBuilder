import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AI_PROVIDER } from './providers/ai-provider.interface';
import { PuckCloudProvider } from './providers/puck-cloud.provider';

/**
 * AI module composition root.
 *
 * This module decides which provider implementation is active at runtime,
 * using AI_PROVIDER from environment configuration.
 */
@Module({
  imports: [AuthModule],
  controllers: [AiController],
  providers: [
    PuckCloudProvider,
    {
      provide: AI_PROVIDER,
      inject: [ConfigService, PuckCloudProvider],
      useFactory: (
        configService: ConfigService,
        puckCloudProvider: PuckCloudProvider,
      ) => {
        // Runtime provider switch. Keep all provider branching in one place.
        const providerName = configService.get<string>(
          'AI_PROVIDER',
          'puck-cloud',
        );

        // Provider selection stays centralized here for future model/provider swaps.
        switch (providerName) {
          case 'puck-cloud':
          default:
            return puckCloudProvider;
        }
      },
    },
    AiService,
  ],
})
export class AiModule {}
