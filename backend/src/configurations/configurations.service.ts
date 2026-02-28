import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertConfigurationDto } from './dto/upsert-configuration.dto';

@Injectable()
export class ConfigurationsService {
	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Ensure the project exists and belongs to the authenticated user.
	 * This prevents one user from reading/writing another user's project configuration.
	 */
	private async assertProjectOwnership(projectId: string, userId: string) {
		const project = await this.prisma.project.findUnique({
			where: { id: projectId },
			select: { id: true, userId: true, projectName: true },
		});

		if (!project) {
			throw new NotFoundException('Project not found');
		}

		if (project.userId !== userId) {
			throw new ForbiddenException('You cannot access this project');
		}

		return project;
	}

	/**
	 * Save or update builder config for a project.
	 * Using upsert means:
	 * - create config first time
	 * - update existing config next times
	 */
	async upsertByProject(
		projectId: string,
		userId: string,
		dto: UpsertConfigurationDto,
	) {
		await this.assertProjectOwnership(projectId, userId);

		// Prisma expects JSON payloads to use InputJsonValue typing.
		const configJson = dto.configJson as Prisma.InputJsonValue;

		return this.prisma.configuration.upsert({
			where: { projectId },
			create: {
				projectId,
				configJson,
			},
			update: {
				configJson,
			},
		});
	}

	/**
	 * Get saved builder config for a project.
	 */
	async getByProject(projectId: string, userId: string) {
		await this.assertProjectOwnership(projectId, userId);

		const config = await this.prisma.configuration.findUnique({
			where: { projectId },
		});

		return (
			config ?? {
				projectId,
				configJson: {
					pages: [],
					theme: {},
				},
			}
		);
	}

	/**
	 * Preview data endpoint helper.
	 * This mock data is useful before schools connect real production data.
	 */
	async getPreviewMockData(projectId: string, userId: string) {
		await this.assertProjectOwnership(projectId, userId);

		return {
			students: [
				{ id: 'st-1', name: 'Ada Obi', grade: 'Primary 3' },
				{ id: 'st-2', name: 'Musa Bello', grade: 'Primary 5' },
			],
			grades: [
				{ studentId: 'st-1', subject: 'Math', score: 88 },
				{ studentId: 'st-2', subject: 'English', score: 91 },
			],
			announcements: [
				{ id: 'an-1', title: 'Resumption Date', content: 'School resumes on Monday.' },
			],
		};
	}
}
