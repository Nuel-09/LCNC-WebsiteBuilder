import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

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
}
