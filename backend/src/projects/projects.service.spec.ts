import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  const prisma = {
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService;

  const service = new ProjectsService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a project for a user', async () => {
    (prisma.project.create as jest.Mock).mockResolvedValue({ id: 'p1' });

    await service.create('u1', {
      projectName: 'School Website',
      schoolType: 'secondary',
    });

    expect(prisma.project.create).toHaveBeenCalledWith({
      data: {
        userId: 'u1',
        projectName: 'School Website',
        schoolType: 'secondary',
      },
    });
  });

  it('lists user projects ordered by createdAt desc', async () => {
    await service.findAllByUser('u1');

    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('throws NotFoundException when updating a non-existent project', async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      service.updateByUser('missing', 'u1', { projectName: 'New name' }),
    ).rejects.toThrow(new NotFoundException('Project not found'));
  });

  it('throws ForbiddenException when user does not own project', async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({
      id: 'p1',
      userId: 'owner',
    });

    await expect(
      service.updateByUser('p1', 'intruder', { projectName: 'New name' }),
    ).rejects.toThrow(new ForbiddenException('You cannot access this project'));
  });

  it('updates only provided project fields', async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({
      id: 'p1',
      userId: 'u1',
    });
    (prisma.project.update as jest.Mock).mockResolvedValue({ id: 'p1' });

    await service.updateByUser('p1', 'u1', { schoolType: 'primary' });

    expect(prisma.project.update).toHaveBeenCalledWith({
      where: { id: 'p1' },
      data: { schoolType: 'primary' },
    });
  });

  it('deletes project when ownership check passes', async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({
      id: 'p1',
      userId: 'u1',
    });

    await expect(service.removeByUser('p1', 'u1')).resolves.toEqual({
      success: true,
    });
    expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: 'p1' } });
  });
});
