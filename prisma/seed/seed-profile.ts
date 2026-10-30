import { createHash } from 'node:crypto';
import type { PrismaClient } from '../../src/generated/prisma/client';
import type { ProfileSeed } from './profile-seed.types';

export type SeedResult = 'created' | 'updated' | 'unchanged';

/** Ключ advisory lock в PostgreSQL. Любое число, общее для всех экземпляров приложения. */
const SEED_LOCK_KEY = 4_244_000;

export function checksumOf(data: ProfileSeed): string {
  return createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

/**
 * Идемпотентный сид профиля. Безопасно запускать при каждом старте.
 *
 * 1. Всё выполняется в одной транзакции под advisory lock: два экземпляра,
 *    стартующих одновременно, не запишут данные дважды.
 * 2. Если хэш данных совпадает с сохранённым в seed_state, ничего не пишется.
 * 3. Иначе профиль обновляется по slug (upsert), а дочерние записи заменяются целиком.
 *    Файл данных - единственный источник правды, дублей быть не может.
 */
export async function seedProfile(prisma: PrismaClient, data: ProfileSeed): Promise<SeedResult> {
  const checksum = checksumOf(data);
  const stateKey = `profile:${data.slug}`;

  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${SEED_LOCK_KEY}::bigint)`;

      const state = await tx.seedState.findUnique({ where: { key: stateKey } });
      if (state?.checksum === checksum) {
        return 'unchanged';
      }

      const fields = {
        name: data.name,
        title: data.title,
        description: data.description,
        location: data.location ?? null,
      };
      const existing = await tx.profile.findUnique({ where: { slug: data.slug } });
      const profile = await tx.profile.upsert({
        where: { slug: data.slug },
        create: { slug: data.slug, ...fields },
        update: fields,
      });
      const profileId = profile.id;

      // Достижения удаляются каскадом вместе с опытом работы.
      await tx.link.deleteMany({ where: { profileId } });
      await tx.skill.deleteMany({ where: { profileId } });
      await tx.experience.deleteMany({ where: { profileId } });
      await tx.project.deleteMany({ where: { profileId } });

      await tx.link.createMany({
        data: data.links.map((link, index) => ({ ...link, profileId, sortOrder: index })),
      });
      await tx.skill.createMany({
        data: data.skills.map((skill, index) => ({
          name: skill.name,
          category: skill.category,
          note: skill.note ?? null,
          profileId,
          sortOrder: index,
        })),
      });
      await tx.project.createMany({
        data: data.projects.map((project, index) => ({
          name: project.name,
          description: project.description,
          url: project.url ?? null,
          stack: project.stack,
          profileId,
          sortOrder: index,
        })),
      });
      for (const [index, job] of data.experience.entries()) {
        await tx.experience.create({
          data: {
            profileId,
            company: job.company,
            position: job.position,
            summary: job.summary ?? null,
            startYear: job.start.year,
            startMonth: job.start.month ?? null,
            endYear: job.end?.year ?? null,
            endMonth: job.end?.month ?? null,
            sortOrder: index,
            achievements: {
              create: job.achievements.map((text, position) => ({ text, sortOrder: position })),
            },
          },
        });
      }

      await tx.seedState.upsert({
        where: { key: stateKey },
        create: { key: stateKey, checksum },
        update: { checksum },
      });

      return existing ? 'updated' : 'created';
    },
    { timeout: 30_000 },
  );
}
