import { Controller, Get, Param } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';

/**
 * Public published-site endpoint.
 * Serves the latest published snapshot without requiring login.
 */
@Controller('public/projects')
export class PublicSiteController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @Get(':projectId/published')
  getPublishedSite(@Param('projectId') projectId: string) {
    return this.configurationsService.getPublishedSiteByProject(projectId);
  }
}
