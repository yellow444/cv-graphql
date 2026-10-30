import { Injectable } from '@nestjs/common';
import type { Skill as SkillRecord } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Один запрос на всех родителей: WHERE profile_id IN (...). */
  findByProfileIds(profileIds: readonly number[]): Promise<SkillRecord[]> {
    return this.prisma.skill.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
