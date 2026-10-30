import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaPg } from '@prisma/adapter-pg';
import request from 'supertest';
import type { App } from 'supertest/types';
import { profileSeed } from '../prisma/seed/profile.data';
import { seedProfile } from '../prisma/seed/seed-profile';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';

/**
 * e2e-тесты поднимают приложение целиком и ходят в настоящую PostgreSQL.
 * Перед запуском: docker compose up -d db && npm run db:migrate
 */
describe('GraphQL API (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaClient<'query'>;
  const sqlQueries: string[] = [];

  const graphql = (query: string) =>
    request(app.getHttpServer()).post('/graphql').send({ query }).expect(200);

  beforeAll(async () => {
    // Клиент с журналом SQL: по нему считаем, сколько запросов ушло в базу.
    prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
      log: [{ emit: 'event', level: 'query' }],
    });
    prisma.$on('query', (event) => sqlQueries.push(event.query));

    await seedProfile(prisma, profileSeed);

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('answers the example query from the task', async () => {
    const { body } = await graphql(
      'query { profile { name description skills { name } experience { company position } projects { name } } }',
    );

    expect(body.errors).toBeUndefined();
    const { profile } = body.data;
    expect(profile.name).toBe(profileSeed.name);
    expect(profile.skills).toHaveLength(profileSeed.skills.length);
    expect(profile.experience[0]).toEqual({
      company: profileSeed.experience[0].company,
      position: profileSeed.experience[0].position,
    });
    expect(profile.projects.map((project: { name: string }) => project.name)).toEqual(
      profileSeed.projects.map((project) => project.name),
    );
  });

  it('loads all nested data with one SQL query per level (no N+1)', async () => {
    sqlQueries.length = 0;

    const { body } = await graphql(`
      query {
        profile {
          name
          links {
            url
          }
          skills {
            name
          }
          experience {
            company
            period
            achievements
          }
          projects {
            name
            stack
          }
        }
      }
    `);

    expect(body.errors).toBeUndefined();
    expect(body.data.profile.experience.length).toBeGreaterThan(1);
    // profile, links, skills, experience, achievements, projects.
    // Без DataLoader достижения грузились бы отдельным запросом на каждое место работы.
    expect(sqlQueries).toHaveLength(6);
  });

  it('filters skills by category', async () => {
    const { body } = await graphql('query { profile { skills(category: DEVOPS) { category } } }');

    const categories = body.data.profile.skills.map(
      (skill: { category: string }) => skill.category,
    );
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories)).toEqual(new Set(['DEVOPS']));
  });

  it('serves Apollo Sandbox on GET /graphql', async () => {
    const response = await request(app.getHttpServer())
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(200);

    expect(response.text).toContain('embeddable-sandbox');
  });

  it('reports health', async () => {
    await request(app.getHttpServer()).get('/health').expect(200, { status: 'ok' });
  });

  describe('seed', () => {
    const countRows = async () => ({
      profiles: await prisma.profile.count({ where: { slug: profileSeed.slug } }),
      skills: await prisma.skill.count({ where: { profile: { slug: profileSeed.slug } } }),
      achievements: await prisma.achievement.count({
        where: { experience: { profile: { slug: profileSeed.slug } } },
      }),
    });

    afterAll(async () => {
      // Возвращаем данные из файла, если тест ниже упал посередине.
      await seedProfile(prisma, profileSeed);
    });

    it('does nothing when the data has not changed', async () => {
      const before = await countRows();

      await expect(seedProfile(prisma, profileSeed)).resolves.toBe('unchanged');
      expect(await countRows()).toEqual(before);
    });

    it('replaces the data without duplicates when the seed file changes', async () => {
      const changed = {
        ...profileSeed,
        skills: [...profileSeed.skills, { name: 'Test skill', category: 'AI' as const }],
      };

      await expect(seedProfile(prisma, changed)).resolves.toBe('updated');
      await expect(seedProfile(prisma, changed)).resolves.toBe('unchanged');
      expect((await countRows()).skills).toBe(profileSeed.skills.length + 1);

      await expect(seedProfile(prisma, profileSeed)).resolves.toBe('updated');
      expect(await countRows()).toEqual({
        profiles: 1,
        skills: profileSeed.skills.length,
        achievements: profileSeed.experience.flatMap((job) => job.achievements).length,
      });
    });
  });
});
