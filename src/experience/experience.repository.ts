import { Injectable } from '@nestjs/common';
import type {
  Achievement as AchievementRecord,
  Experience as ExperienceRecord,
} from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileIds(profileIds: readonly number[]): Promise<ExperienceRecord[]> {
    return this.prisma.experience.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  /** Достижения сразу для всех мест работы из запроса: один SELECT вместо N. */
  findAchievementsByExperienceIds(experienceIds: readonly number[]): Promise<AchievementRecord[]> {
    return this.prisma.achievement.findMany({
      where: { experienceId: { in: [...experienceIds] } },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
