import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { Env } from './config/env.validation';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  // API только на чтение и без cookie, поэтому открыт для любых источников.
  app.enableCors();
  // Корректное завершение по SIGTERM от Docker и Render: Prisma закрывает соединения.
  app.enableShutdownHooks();

  const config: ConfigService<Env, true> = app.get(ConfigService);
  const port = config.get('PORT', { infer: true });
  await app.listen(port, '0.0.0.0');
  Logger.log(`GraphQL API and Apollo Sandbox: http://localhost:${port}/graphql`, 'Bootstrap');
}

void bootstrap();
