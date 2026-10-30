import { Test } from '@nestjs/testing';
import { ExperienceService } from '../experience/experience.service';
import { ProfileService } from '../profile/profile.service';
import { ProjectsService } from '../projects/projects.service';
import { SkillsService } from '../skills/skills.service';
import { LoadersFactory } from './loaders.factory';

describe('LoadersFactory', () => {
  let factory: LoadersFactory;
  const experienceService = {
    getByProfileIds: jest.fn(),
    getAchievementsByExperienceIds: jest.fn<Promise<Map<number, string[]>>, [readonly number[]]>(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoadersFactory,
        { provide: ExperienceService, useValue: experienceService },
        { provide: ProfileService, useValue: {} },
        { provide: SkillsService, useValue: {} },
        { provide: ProjectsService, useValue: {} },
      ],
    }).compile();
    factory = moduleRef.get(LoadersFactory);
  });

  it('batches loads made in the same tick into one service call (no N+1)', async () => {
    experienceService.getAchievementsByExperienceIds.mockResolvedValue(
      new Map([
        [1, ['a']],
        [3, ['c']],
      ]),
    );
    const { achievementsByExperienceId } = factory.create();

    // Так GraphQL резолвит achievements для каждого места работы из списка.
    const results = await Promise.all([1, 2, 3].map((id) => achievementsByExperienceId.load(id)));

    expect(experienceService.getAchievementsByExperienceIds).toHaveBeenCalledTimes(1);
    expect(experienceService.getAchievementsByExperienceIds).toHaveBeenCalledWith([1, 2, 3]);
    expect(results).toEqual([['a'], [], ['c']]);
  });

  it('creates independent loaders for each request', async () => {
    experienceService.getAchievementsByExperienceIds.mockResolvedValue(new Map());

    await factory.create().achievementsByExperienceId.load(1);
    await factory.create().achievementsByExperienceId.load(1);

    // У каждого запроса свой кэш, поэтому второй запрос снова идёт в сервис.
    expect(experienceService.getAchievementsByExperienceIds).toHaveBeenCalledTimes(2);
  });
});
