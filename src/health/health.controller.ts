import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** Проверка живости для Docker healthcheck и Render: приложение отвечает и база доступна. */
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check(): Promise<{ status: 'ok' }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException('Database is unavailable');
    }
    return { status: 'ok' };
  }
}
