import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z
    .string()
    .regex(/^postgres(ql)?:\/\//, 'ожидается строка подключения PostgreSQL: postgresql://...'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Проверка переменных окружения при старте.
 * Приложение не запустится с неполной конфигурацией, ошибка сразу назовёт переменную.
 */
export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
