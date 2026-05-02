import { Module } from '@nestjs/common';
import { ConfigurationsController } from './configurations.controller';
import { ConfigurationsService } from './configurations.service';
import { PublicSiteController } from './public-site.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Configuration module:
 * - stores and retrieves builder JSON per project
 * - provides preview mock data for frontend demo mode
 */
@Module({
  imports: [AuthModule],
  controllers: [ConfigurationsController, PublicSiteController],
  providers: [ConfigurationsService, JwtAuthGuard],
})
export class ConfigurationsModule {}
