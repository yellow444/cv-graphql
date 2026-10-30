import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { ExperienceService } from '../experience/experience.service';
import { ProfileService } from '../profile/profile.service';
import { ProjectsService } from '../projects/projects.service';
import { SkillsService } from '../skills/skills.service';
import type { DataLoaders } from './data-loaders';

/**
 * Создаёт новый набор загрузчиков на каждый GraphQL-запрос.
 * Все вызовы load() одного уровня запроса собираются в один batch, то есть в один SQL-запрос.
 * Кэш живёт только внутри запроса, поэтому данные разных запросов не смешиваются.
 */
@Injectable()
export class LoadersFactory {
  constructor(
    private readonly profileService: ProfileService,
    private readonly skillsService: SkillsService,
    private readonly experienceService: ExperienceService,
    private readonly projectsService: ProjectsService,
  ) {}

  create(): DataLoaders {
    return {
      linksByProfileId: batchByParent((ids) => this.profileService.getLinksByProfileIds(ids)),
      skillsByProfileId: batchByParent((ids) => this.skillsService.getByProfileIds(ids)),
      experienceByProfileId: batchByParent((ids) => this.experienceService.getByProfileIds(ids)),
      achievementsByExperienceId: batchByParent((ids) =>
        this.experienceService.getAchievementsByExperienceIds(ids),
      ),
      projectsByProfileId: batchByParent((ids) => this.projectsService.getByProfileIds(ids)),
    };
  }
}

/**
 * DataLoader ждёт ответ в том же порядке, что и ключи.
 * Сервис возвращает Map с ключом id родителя, здесь она раскладывается по ключам,
 * а родитель без записей получает пустой список.
 */
function batchByParent<V>(
  loadGrouped: (parentIds: readonly number[]) => Promise<Map<number, V[]>>,
): DataLoader<number, V[]> {
  return new DataLoader<number, V[]>(async (parentIds) => {
    const grouped = await loadGrouped(parentIds);
    return parentIds.map((id) => grouped.get(id) ?? []);
  });
}
