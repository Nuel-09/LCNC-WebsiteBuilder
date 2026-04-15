import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertConfigurationDto } from './dto/upsert-configuration.dto';

type StoredConfigurationPayload = {
  draft: Prisma.InputJsonValue;
  published: Prisma.InputJsonValue | null;
  publishedAt: string | null;
};

/**
 * Configuration service
 *
 * Responsibilities:
 * - enforce project ownership for secure access
 * - normalize config payloads for backward compatibility
 * - store and return a stable builder config shape
 */
@Injectable()
export class ConfigurationsService {
  constructor(private readonly prisma: PrismaService) {}

  // Theme defaults used whenever a saved config omits theme keys.
  private readonly defaultTheme = {
    primaryColor: '#4f6bed',
    secondaryColor: '#2f36b8',
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  };

  // Default navigation items for new projects and legacy migrations.
  private readonly defaultNavMenu = ['Home', 'About', 'Programs', 'Contact'];

  // Canonical default config shape used as fallback for empty/invalid payloads.
  private getDefaultBuilderConfig() {
    return {
      site: {
        theme: this.defaultTheme,
        navigation: {
          menu: this.defaultNavMenu,
        },
      },
      pages: [
        {
          id: 'home',
          title: 'Home',
          slug: 'home',
          content: [],
        },
      ],
      activePageId: 'home',
      // Backward compatibility for consumers that still read top-level content.
      content: [],
    } as Prisma.InputJsonValue;
  }

  /**
   * Parse mixed storage formats and return a stable internal draft/published shape.
   */
  private normalizeStoredConfiguration(
    input: unknown,
  ): StoredConfigurationPayload {
    const normalizedInput = this.normalizeConfigJson(input);

    if (
      normalizedInput &&
      typeof normalizedInput === 'object' &&
      !Array.isArray(normalizedInput)
    ) {
      const obj = normalizedInput as Record<string, unknown>;

      // New storage model: { draft, published, publishedAt }.
      if ('draft' in obj || 'published' in obj) {
        const draft = this.ensureBuilderShape(
          this.normalizeConfigJson(obj.draft ?? this.getDefaultBuilderConfig()),
        );

        const published =
          obj.published === null || obj.published === undefined
            ? null
            : this.ensureBuilderShape(this.normalizeConfigJson(obj.published));

        return {
          draft,
          published,
          publishedAt:
            typeof obj.publishedAt === 'string' ? obj.publishedAt : null,
        };
      }
    }

    // Legacy storage model: plain builder config object.
    return {
      draft: this.ensureBuilderShape(normalizedInput),
      published: null,
      publishedAt: null,
    };
  }

  /**
   * Persist stored configuration in the new draft/published envelope.
   */
  private toStoredConfigJson(
    payload: StoredConfigurationPayload,
  ): Prisma.InputJsonValue {
    return {
      draft: payload.draft,
      published: payload.published,
      publishedAt: payload.publishedAt,
    } as Prisma.InputJsonValue;
  }

  /**
   * Ensure config JSON is always stored as an object/array, not as a raw string.
   * This keeps API responses consistent for the frontend builder.
   */
  private normalizeConfigJson(input: unknown): Prisma.InputJsonValue {
    if (typeof input === 'string') {
      try {
        return JSON.parse(input) as Prisma.InputJsonValue;
      } catch {
        return { content: [] } as Prisma.InputJsonValue;
      }
    }

    if (input === null || input === undefined) {
      return { content: [] } as Prisma.InputJsonValue;
    }

    return input as Prisma.InputJsonValue;
  }

  /**
   * Ensure saved config always has a stable shape for future multi-page support,
   * while preserving backward compatibility with legacy single-page { content: [] } payloads.
   */
  private ensureBuilderShape(
    input: Prisma.InputJsonValue,
  ): Prisma.InputJsonValue {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return this.getDefaultBuilderConfig();
    }

    const obj = input as Record<string, unknown>;

    const pages =
      Array.isArray(obj.pages) && obj.pages.length > 0
        ? obj.pages
            .map((page, index) => {
              if (!page || typeof page !== 'object') {
                return null;
              }

              const pageObj = page as Record<string, unknown>;

              return {
                id:
                  typeof pageObj.id === 'string'
                    ? pageObj.id
                    : `page-${index + 1}`,
                title:
                  typeof pageObj.title === 'string'
                    ? pageObj.title
                    : `Page ${index + 1}`,
                slug:
                  typeof pageObj.slug === 'string'
                    ? pageObj.slug
                    : `page-${index + 1}`,
                content: Array.isArray(pageObj.content) ? pageObj.content : [],
              };
            })
            .filter(
              (
                page,
              ): page is {
                id: string;
                title: string;
                slug: string;
                content: unknown[];
              } => Boolean(page),
            )
        : [
            {
              id: 'home',
              title: 'Home',
              slug: 'home',
              content: Array.isArray(obj.content) ? obj.content : [],
            },
          ];

    if (pages.length === 0) {
      pages.push({
        id: 'home',
        title: 'Home',
        slug: 'home',
        content: [],
      });
    }

    const activePageId =
      typeof obj.activePageId === 'string' &&
      pages.some((page) => page.id === obj.activePageId)
        ? obj.activePageId
        : pages[0].id;

    const activePage =
      pages.find((page) => page.id === activePageId) ?? pages[0];

    const site = {
      theme: {
        ...this.defaultTheme,
        ...(obj.site &&
        typeof obj.site === 'object' &&
        (obj.site as Record<string, unknown>).theme &&
        typeof (obj.site as Record<string, unknown>).theme === 'object'
          ? ((obj.site as Record<string, unknown>).theme as Record<
              string,
              unknown
            >)
          : {}),
      },
      navigation: {
        menu:
          obj.site &&
          typeof obj.site === 'object' &&
          (obj.site as Record<string, unknown>).navigation &&
          typeof (obj.site as Record<string, unknown>).navigation ===
            'object' &&
          Array.isArray(
            (
              (obj.site as Record<string, unknown>).navigation as Record<
                string,
                unknown
              >
            ).menu,
          )
            ? ((
                (obj.site as Record<string, unknown>).navigation as Record<
                  string,
                  unknown
                >
              ).menu as unknown[])
            : this.defaultNavMenu,
      },
    };

    return {
      site,
      pages,
      activePageId,
      content: activePage.content,
    } as Prisma.InputJsonValue;
  }

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

    const existing = await this.prisma.configuration.findUnique({
      where: { projectId },
      select: { configJson: true },
    });

    const existingStored = this.normalizeStoredConfiguration(
      existing?.configJson,
    );

    const draftConfig = this.ensureBuilderShape(
      this.normalizeConfigJson(dto.configJson),
    );

    const nextStored: StoredConfigurationPayload = {
      ...existingStored,
      draft: draftConfig,
    };

    const saved = await this.prisma.configuration.upsert({
      where: { projectId },
      create: {
        projectId,
        configJson: this.toStoredConfigJson(nextStored),
      },
      update: {
        configJson: this.toStoredConfigJson(nextStored),
      },
    });

    return {
      ...saved,
      configJson: draftConfig,
      publishedAt: nextStored.publishedAt,
    };
  }

  /**
   * Get saved builder config for a project.
   */
  async getByProject(projectId: string, userId: string) {
    await this.assertProjectOwnership(projectId, userId);

    const config = await this.prisma.configuration.findUnique({
      where: { projectId },
    });

    if (!config) {
      return {
        projectId,
        configJson: this.getDefaultBuilderConfig(),
        publishedAt: null,
      };
    }

    const stored = this.normalizeStoredConfiguration(
      config.configJson as Prisma.InputJsonValue,
    );

    return {
      ...config,
      configJson: stored.draft,
      publishedAt: stored.publishedAt,
    };
  }

  /**
   * Publish the latest draft configuration so preview can render a stable snapshot.
   */
  async publishByProject(projectId: string, userId: string) {
    await this.assertProjectOwnership(projectId, userId);

    const existing = await this.prisma.configuration.findUnique({
      where: { projectId },
    });

    const existingStored = this.normalizeStoredConfiguration(
      existing?.configJson ?? this.getDefaultBuilderConfig(),
    );

    const publishedAt = new Date().toISOString();

    const nextStored: StoredConfigurationPayload = {
      ...existingStored,
      published: existingStored.draft,
      publishedAt,
    };

    const saved = await this.prisma.configuration.upsert({
      where: { projectId },
      create: {
        projectId,
        configJson: this.toStoredConfigJson(nextStored),
      },
      update: {
        configJson: this.toStoredConfigJson(nextStored),
      },
    });

    return {
      ...saved,
      configJson: nextStored.published,
      publishedAt,
    };
  }

  /**
   * Return published config for preview. If not yet published, fall back to draft.
   */
  async getPublishedByProject(projectId: string, userId: string) {
    await this.assertProjectOwnership(projectId, userId);

    const config = await this.prisma.configuration.findUnique({
      where: { projectId },
    });

    if (!config) {
      return {
        projectId,
        configJson: this.getDefaultBuilderConfig(),
        publishedAt: null,
        usingDraftFallback: true,
      };
    }

    const stored = this.normalizeStoredConfiguration(
      config.configJson as Prisma.InputJsonValue,
    );

    return {
      ...config,
      configJson: stored.published ?? stored.draft,
      publishedAt: stored.publishedAt,
      usingDraftFallback: stored.published === null,
    };
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
        {
          id: 'an-1',
          title: 'Resumption Date',
          content: 'School resumes on Monday.',
        },
      ],
    };
  }
}
