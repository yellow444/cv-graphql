import { Injectable } from '@nestjs/common';
import { groupBy } from '../common/group-by';
import type { Experience as ExperienceRecord } from '../generated/prisma/client';
import type { Experience } from './experience.model';
import { ExperienceRepository } from './experience.repository';
import { formatPeriod, toIsoDate, type YearMonth } from './period';

@Injectable()
export class ExperienceService {
  constructor(private readonly repository: ExperienceRepository) {}

  /** Опыт работы, сгруппированный по id профиля. */
  async getByProfileIds(profileIds: readonly number[]): Promise<Map<number, Experience[]>> {
    const records = await this.repository.findByProfileIds(profileIds);
    return groupBy(records, (record) => record.profileId, toExperience);
  }

  /** Тексты достижений, сгруппированные по id места работы. */
  async getAchievementsByExperienceIds(
    experienceIds: readonly number[],
  ): Promise<Map<number, string[]>> {
    const records = await this.repository.findAchievementsByExperienceIds(experienceIds);
    return groupBy(
      records,
      (record) => record.experienceId,
      (record) => record.text,
    );
  }
}

function toExperience(record: ExperienceRecord): Experience {
  const start: YearMonth = { year: record.startYear, month: record.startMonth };
  const end: YearMonth | null =
    record.endYear === null ? null : { year: record.endYear, month: record.endMonth };

  return {
    id: record.id,
    company: record.company,
    position: record.position,
    summary: record.summary,
    startDate: toIsoDate(start),
    endDate: end && toIsoDate(end),
    period: formatPeriod(start, end),
  };
}
