import { Injectable } from '@nestjs/common';
import type { Project as ProjectRecord } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileIds(profileIds: readonly number[]): Promise<ProjectRecord[]> {
    return this.prisma.project.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
