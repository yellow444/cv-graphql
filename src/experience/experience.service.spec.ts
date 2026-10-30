import { Test } from '@nestjs/testing';
import type { Achievement, Experience } from '../generated/prisma/client';
import { ExperienceRepository } from './experience.repository';
import { ExperienceService } from './experience.service';

const experienceRecord = (overrides: Partial<Experience>): Experience => ({
  id: 1,
  profileId: 1,
  company: 'Company',
  position: 'Developer',
  summary: null,
  startYear: 2021,
  startMonth: 9,
  endYear: null,
  endMonth: null,
  sortOrder: 0,
  ...overrides,
});

describe('ExperienceService', () => {
  let service: ExperienceService;
  const repository = {
    findByProfileIds: jest.fn<Promise<Experience[]>, [readonly number[]]>(),
    findAchievementsByExperienceIds: jest.fn<Promise<Achievement[]>, [readonly number[]]>(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [ExperienceService, { provide: ExperienceRepository, useValue: repository }],
    }).compile();
    service = moduleRef.get(ExperienceService);
  });

  it('groups experience by profile and formats periods', async () => {
    repository.findByProfileIds.mockResolvedValue([
      experienceRecord({ id: 1, profileId: 1, endYear: 2026, endMonth: 10 }),
      experienceRecord({ id: 2, profileId: 2, startYear: 2023, startMonth: null }),
    ]);

    const result = await service.getByProfileIds([1, 2]);

    expect(repository.findByProfileIds).toHaveBeenCalledWith([1, 2]);
    expect(result.get(1)).toEqual([
      {
        id: 1,
        company: 'Company',
        position: 'Developer',
        summary: null,
        startDate: '2021-09',
        endDate: '2026-10',
        period: '09.2021 - 10.2026',
      },
    ]);
    expect(result.get(2)?.[0]).toMatchObject({
      startDate: '2023',
      endDate: null,
      period: 'с 2023',
    });
  });

  it('groups achievement texts by experience in the original order', async () => {
    repository.findAchievementsByExperienceIds.mockResolvedValue([
      { id: 10, experienceId: 1, text: 'first', sortOrder: 0 },
      { id: 11, experienceId: 2, text: 'other', sortOrder: 0 },
      { id: 12, experienceId: 1, text: 'second', sortOrder: 1 },
    ]);

    const result = await service.getAchievementsByExperienceIds([1, 2]);

    expect(result.get(1)).toEqual(['first', 'second']);
    expect(result.get(2)).toEqual(['other']);
  });
});
