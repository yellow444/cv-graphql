import { Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client';
import { profileSeed } from './profile.data';
import { seedProfile } from './seed-profile';

/**
 * Точка входа сида. Запускается при каждом старте контейнера после миграций
 * (docker-entrypoint.sh) и вручную через `npm run db:seed`.
 */
async function main(): Promise<void> {
  const logger = new Logger('Seed');
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const result = await seedProfile(prisma, profileSeed);
    logger.log(`Profile "${profileSeed.slug}": ${result}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  new Logger('Seed').error(error instanceof Error ? (error.stack ?? error.message) : error);
  process.exit(1);
});
