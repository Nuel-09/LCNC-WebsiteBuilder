import {
	Body,
	Controller,
	Get,
	Param,
	Put,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigurationsService } from './configurations.service';
import { UpsertConfigurationDto } from './dto/upsert-configuration.dto';

type AuthenticatedRequest = Request & {
	user: {
		userId: string;
		email: string;
	};
};

/**
 * Configuration routes are nested under project routes because
 * each configuration belongs to a specific project.
 */
@Controller('projects/:projectId/configuration')
@UseGuards(JwtAuthGuard)
export class ConfigurationsController {
	constructor(private readonly configurationsService: ConfigurationsService) {}

	/**
	 * Get saved page-builder JSON for this project.
	 */
	@Get()
	getConfiguration(
		@Param('projectId') projectId: string,
		@Req() request: AuthenticatedRequest,
	) {
		return this.configurationsService.getByProject(projectId, request.user.userId);
	}

	/**
	 * Save/update page-builder JSON for this project.
	 */
	@Put()
	upsertConfiguration(
		@Param('projectId') projectId: string,
		@Req() request: AuthenticatedRequest,
		@Body() dto: UpsertConfigurationDto,
	) {
		return this.configurationsService.upsertByProject(
			projectId,
			request.user.userId,
			dto,
		);
	}

	/**
	 * Return mock records used by preview mode.
	 */
	@Get('preview/mock-data')
	getPreviewMockData(
		@Param('projectId') projectId: string,
		@Req() request: AuthenticatedRequest,
	) {
		return this.configurationsService.getPreviewMockData(
			projectId,
			request.user.userId,
		);
	}
}
