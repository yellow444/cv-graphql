import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Локально переменные берутся из .env, в Docker и на Render их задаёт окружение.
config({ quiet: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
