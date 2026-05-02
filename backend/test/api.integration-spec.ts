import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AiService } from '../src/ai/ai.service';

type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string | null;
  schoolName: string | null;
};

type ProjectRecord = {
  id: string;
  userId: string;
  projectName: string;
  schoolType?: string;
  createdAt: Date;
};

type ConfigurationRecord = {
  id: string;
  projectId: string;
  configJson: unknown;
  createdAt: Date;
  updatedAt: Date;
};

const applySelect = <T extends Record<string, any>>(
  value: T,
  select?: Record<string, boolean>,
) => {
  if (!select) return value;

  const selected: Record<string, unknown> = {};
  Object.keys(select).forEach((key) => {
    if (select[key]) selected[key] = value[key];
  });
  return selected;
};

const createPrismaMock = () => {
  const users: UserRecord[] = [];
  const projects: ProjectRecord[] = [];
  const configurations: ConfigurationRecord[] = [];
  let userCounter = 0;
  let projectCounter = 0;
  let configurationCounter = 0;

  const now = () => new Date();

  return {
    user: {
      findUnique: jest.fn(({ where }: any) => {
        if (where?.email) {
          return Promise.resolve(
            users.find((user) => user.email === where.email) ?? null,
          );
        }
        if (where?.id) {
          return Promise.resolve(
            users.find((user) => user.id === where.id) ?? null,
          );
        }
        return Promise.resolve(null);
      }),
      create: jest.fn(({ data }: any) => {
        const user: UserRecord = {
          id: `u_${++userCounter}`,
          email: data.email,
          passwordHash: data.passwordHash,
          fullName: data.fullName ?? null,
          schoolName: data.schoolName ?? null,
        };
        users.push(user);
        return Promise.resolve(user);
      }),
    },
    project: {
      create: jest.fn(({ data }: any) => {
        const project: ProjectRecord = {
          id: `p_${++projectCounter}`,
          userId: data.userId,
          projectName: data.projectName,
          schoolType: data.schoolType,
          createdAt: now(),
        };
        projects.push(project);
        return Promise.resolve(project);
      }),
      findMany: jest.fn(({ where, orderBy }: any) => {
        let result = [...projects];
        if (where?.userId) {
          result = result.filter((project) => project.userId === where.userId);
        }
        if (orderBy?.createdAt === 'desc') {
          result = result.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );
        }
        return Promise.resolve(result);
      }),
      findUnique: jest.fn(({ where, select }: any) => {
        const project = projects.find((item) => item.id === where.id) ?? null;
        if (!project) return Promise.resolve(null);
        return Promise.resolve(applySelect(project, select));
      }),
      update: jest.fn(({ where, data }: any) => {
        const index = projects.findIndex((item) => item.id === where.id);
        if (index === -1) throw new Error('Project not found');
        projects[index] = {
          ...projects[index],
          ...data,
        };
        return Promise.resolve(projects[index]);
      }),
      delete: jest.fn(({ where }: any) => {
        const index = projects.findIndex((item) => item.id === where.id);
        if (index >= 0) {
          projects.splice(index, 1);
        }
        const configurationIndex = configurations.findIndex(
          (item) => item.projectId === where.id,
        );
        if (configurationIndex >= 0) {
          configurations.splice(configurationIndex, 1);
        }
        return Promise.resolve({ id: where.id });
      }),
    },
    configuration: {
      findUnique: jest.fn(({ where, select }: any) => {
        const config =
          configurations.find((item) => item.projectId === where.projectId) ??
          null;
        if (!config) return Promise.resolve(null);
        return Promise.resolve(applySelect(config, select));
      }),
      upsert: jest.fn(({ where, create, update }: any) => {
        const existingIndex = configurations.findIndex(
          (item) => item.projectId === where.projectId,
        );

        if (existingIndex === -1) {
          const created: ConfigurationRecord = {
            id: `cfg_${++configurationCounter}`,
            projectId: create.projectId,
            configJson: create.configJson,
            createdAt: now(),
            updatedAt: now(),
          };
          configurations.push(created);
          return Promise.resolve(created);
        }

        configurations[existingIndex] = {
          ...configurations[existingIndex],
          ...update,
          updatedAt: now(),
        };
        return Promise.resolve(configurations[existingIndex]);
      }),
    },
  };
};

describe('API Integration (AppModule + Controllers + Guards)', () => {
  let app: INestApplication;
  let aiServiceMock: { chat: jest.Mock };

  const signupAndLogin = async (email: string) => {
    const signupPayload = {
      email,
      password: 'password123',
      fullName: 'Integration User',
      schoolName: 'Integration School',
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupPayload)
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: signupPayload.email,
        password: signupPayload.password,
      })
      .expect(201);

    return login.body.token as string;
  };

  beforeAll(async () => {
    const prismaMock = createPrismaMock();
    aiServiceMock = {
      chat: jest.fn(
        async () =>
          new Response(JSON.stringify({ ok: true, provider: 'mock-ai' }), {
            status: 201,
            headers: {
              'content-type': 'application/json',
              'x-integration-ai': 'mocked',
            },
          }),
      ),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideProvider(AiService)
      .useValue(aiServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('denies protected route access without token', async () => {
    await request(app.getHttpServer()).get('/projects').expect(401);
  });

  it('returns validation error for invalid signup payload', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'not-an-email',
        password: '123',
      })
      .expect(400);
  });

  it('returns validation error for invalid project payload', async () => {
    const token = await signupAndLogin('validation.user@school.com');

    await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ projectName: 'ab' })
      .expect(400);
  });

  it('returns validation error for malformed configuration payload', async () => {
    const token = await signupAndLogin('config.validation@school.com');

    const project = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        projectName: 'Validation Config Project',
        schoolType: 'secondary',
      })
      .expect(201);

    await request(app.getHttpServer())
      .put(`/projects/${project.body.id}/configuration`)
      .set('Authorization', `Bearer ${token}`)
      .send({ configJson: 'not-json-object' })
      .expect(400);
  });

  it('blocks cross-user access to project/configuration resources', async () => {
    const ownerToken = await signupAndLogin('owner.user@school.com');
    const intruderToken = await signupAndLogin('intruder.user@school.com');

    const ownedProject = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ projectName: 'Owner Project', schoolType: 'primary' })
      .expect(201);

    const projectId = ownedProject.body.id;

    await request(app.getHttpServer())
      .get(`/projects/${projectId}/configuration`)
      .set('Authorization', `Bearer ${intruderToken}`)
      .expect(403);

    await request(app.getHttpServer())
      .patch(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${intruderToken}`)
      .send({ projectName: 'Hijacked Name' })
      .expect(403);

    await request(app.getHttpServer())
      .delete(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${intruderToken}`)
      .expect(403);
  });

  it('exposes AI route contract with auth and mocked provider response', async () => {
    const token = await signupAndLogin('ai.integration@school.com');

    await request(app.getHttpServer()).post('/ai/chat').send({}).expect(401);

    const response = await request(app.getHttpServer())
      .post('/ai/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({
        projectId: 'project_1',
        messages: [
          {
            role: 'user',
            parts: [{ type: 'text', text: 'Build a landing page' }],
          },
        ],
      })
      .expect(201);

    expect(response.body).toEqual({ ok: true, provider: 'mock-ai' });
    expect(response.headers['x-integration-ai']).toBe('mocked');
    expect(aiServiceMock.chat).toHaveBeenCalledTimes(1);
  });

  it('supports signup, login, project and configuration lifecycle', async () => {
    const signupPayload = {
      email: 'integration.user@school.com',
      password: 'password123',
      fullName: 'Integration User',
      schoolName: 'Integration School',
    };

    const signup = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupPayload)
      .expect(201);

    expect(signup.body.token).toBeDefined();
    expect(signup.body.user.email).toBe(signupPayload.email);

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: signupPayload.email,
        password: signupPayload.password,
      })
      .expect(201);

    const token = login.body.token;
    expect(token).toBeDefined();

    const createdProject = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        projectName: 'Integration Site',
        schoolType: 'secondary',
      })
      .expect(201);

    const projectId = createdProject.body.id;
    expect(projectId).toBeDefined();

    const listProjects = await request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(listProjects.body).toHaveLength(1);
    expect(listProjects.body[0].projectName).toBe('Integration Site');

    const updatedProject = await request(app.getHttpServer())
      .patch(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ projectName: 'Integration Site Updated' })
      .expect(200);

    expect(updatedProject.body.projectName).toBe('Integration Site Updated');

    const draftConfig = {
      site: {
        theme: {
          primaryColor: '#111111',
        },
      },
      content: [
        {
          type: 'Hero',
          props: {
            heading: 'Welcome to Integration School',
          },
        },
      ],
    };

    const saveConfiguration = await request(app.getHttpServer())
      .put(`/projects/${projectId}/configuration`)
      .set('Authorization', `Bearer ${token}`)
      .send({ configJson: draftConfig })
      .expect(200);

    expect(saveConfiguration.body.configJson).toBeDefined();

    const getConfiguration = await request(app.getHttpServer())
      .get(`/projects/${projectId}/configuration`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getConfiguration.body.configJson).toBeDefined();
    expect(getConfiguration.body.configJson.pages[0].content).toHaveLength(1);

    const publishConfiguration = await request(app.getHttpServer())
      .post(`/projects/${projectId}/configuration/publish`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(publishConfiguration.body.publishedAt).toBeDefined();

    const getPublished = await request(app.getHttpServer())
      .get(`/projects/${projectId}/configuration/published`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getPublished.body.configJson).toBeDefined();

    await request(app.getHttpServer())
      .delete(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const projectsAfterDelete = await request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(projectsAfterDelete.body).toHaveLength(0);
  });

  it('serves the public live site only after publish', async () => {
    const token = await signupAndLogin('public.site@school.com');

    const project = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ projectName: 'Public Site Project', schoolType: 'primary' })
      .expect(201);

    const projectId = project.body.id;

    await request(app.getHttpServer())
      .get(`/public/projects/${projectId}/published`)
      .expect(404);

    await request(app.getHttpServer())
      .put(`/projects/${projectId}/configuration`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        configJson: {
          site: { theme: { primaryColor: '#222222' } },
          pages: [
            {
              id: 'home',
              title: 'Home',
              slug: 'home',
              content: [],
            },
          ],
          activePageId: 'home',
        },
      })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/projects/${projectId}/configuration/publish`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const publicSite = await request(app.getHttpServer())
      .get(`/public/projects/${projectId}/published`)
      .expect(200);

    expect(publicSite.body.projectId).toBe(projectId);
    expect(publicSite.body.projectName).toBe('Public Site Project');
    expect(publicSite.body.configJson).toBeDefined();
    expect(publicSite.body.publishedAt).toBeDefined();
  });
});
