import { Test } from '@nestjs/testing';
import { SkillCategory, type Skill as SkillRecord } from '../generated/prisma/client';
import type { Skill } from './skill.model';
import { SkillsRepository } from './skills.repository';
import { SkillsService } from './skills.service';

describe('SkillsService', () => {
  let service: SkillsService;
  const repository = { findByProfileIds: jest.fn<Promise<SkillRecord[]>, [readonly number[]]>() };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [SkillsService, { provide: SkillsRepository, useValue: repository }],
    }).compile();
    service = moduleRef.get(SkillsService);
  });

  it('groups skills by profile and drops storage fields', async () => {
    repository.findByProfileIds.mockResolvedValue([
      {
        id: 1,
        profileId: 7,
        name: 'C#',
        category: SkillCategory.BACKEND,
        note: null,
        sortOrder: 0,
      },
    ]);

    const result = await service.getByProfileIds([7]);

    expect(result.get(7)).toEqual([
      { id: 1, name: 'C#', category: SkillCategory.BACKEND, note: null },
    ]);
  });

  describe('filterByCategory', () => {
    const skills: Skill[] = [
      { id: 1, name: 'C#', category: SkillCategory.BACKEND, note: null },
      { id: 2, name: 'Docker', category: SkillCategory.DEVOPS, note: null },
    ];

    it('returns only skills of the given category', () => {
      expect(service.filterByCategory(skills, SkillCategory.DEVOPS)).toEqual([skills[1]]);
    });

    it('returns all skills when the category is not set', () => {
      expect(service.filterByCategory(skills, undefined)).toBe(skills);
    });
  });
});
