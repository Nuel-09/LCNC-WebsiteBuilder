import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';

/**
 * Projects module:
 * - exposes project endpoints
 * - uses JwtAuthGuard to secure routes
 */
@Module({
  imports: [AuthModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, JwtAuthGuard],
})
export class ProjectsModule {}
