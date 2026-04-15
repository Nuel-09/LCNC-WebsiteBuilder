import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Ensure project exists and belongs to the current user.
   */
  private async assertProjectOwnership(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, userId: true },
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
   * Create a new project owned by a specific user.
   */
  create(userId: string, createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        userId,
        projectName: createProjectDto.projectName,
        schoolType: createProjectDto.schoolType,
      },
    });
  }

  /**
   * Return only projects owned by the specified user.
   */
  findAllByUser(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update project metadata for the current owner.
   */
  async updateByUser(
    projectId: string,
    userId: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    await this.assertProjectOwnership(projectId, userId);

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...(updateProjectDto.projectName !== undefined
          ? { projectName: updateProjectDto.projectName }
          : {}),
        ...(updateProjectDto.schoolType !== undefined
          ? { schoolType: updateProjectDto.schoolType }
          : {}),
      },
    });
  }

  /**
   * Delete a project and its related configuration.
   */
  async removeByUser(projectId: string, userId: string) {
    await this.assertProjectOwnership(projectId, userId);

    await this.prisma.project.delete({
      where: { id: projectId },
    });

    return { success: true };
  }
}
