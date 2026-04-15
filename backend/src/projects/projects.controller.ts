import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    email: string;
  };
};

/**
 * Project endpoints.
 * All routes are protected by JwtAuthGuard.
 */
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Create project for the authenticated user.
   */
  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() body: CreateProjectDto) {
    return this.projectsService.create(request.user.userId, body);
  }

  /**
   * List only projects that belong to the authenticated user.
   */
  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.projectsService.findAllByUser(request.user.userId);
  }

  /**
   * Update a project owned by the authenticated user.
   */
  @Patch(':projectId')
  update(
    @Param('projectId') projectId: string,
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdateProjectDto,
  ) {
    return this.projectsService.updateByUser(
      projectId,
      request.user.userId,
      body,
    );
  }

  /**
   * Delete a project owned by the authenticated user.
   */
  @Delete(':projectId')
  remove(
    @Param('projectId') projectId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.removeByUser(projectId, request.user.userId);
  }
}
