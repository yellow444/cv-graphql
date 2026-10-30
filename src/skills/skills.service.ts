import { Injectable } from '@nestjs/common';
import { groupBy } from '../common/group-by';
import type { Skill, SkillCategory } from './skill.model';
import { SkillsRepository } from './skills.repository';

@Injectable()
export class SkillsService {
  constructor(private readonly repository: SkillsRepository) {}

  /** Навыки, сгруппированные по id профиля. */
  async getByProfileIds(profileIds: readonly number[]): Promise<Map<number, Skill[]>> {
    const records = await this.repository.findByProfileIds(profileIds);
    return groupBy(
      records,
      (record) => record.profileId,
      ({ id, name, category, note }): Skill => ({ id, name, category, note }),
    );
  }

  filterByCategory(skills: Skill[], category?: SkillCategory | null): Skill[] {
    return category ? skills.filter((skill) => skill.category === category) : skills;
  }
}
