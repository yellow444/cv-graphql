import { Injectable } from '@nestjs/common';
import { groupBy } from '../common/group-by';
import type { Project } from './project.model';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(private readonly repository: ProjectsRepository) {}

  /** Проекты, сгруппированные по id профиля. */
  async getByProfileIds(profileIds: readonly number[]): Promise<Map<number, Project[]>> {
    const records = await this.repository.findByProfileIds(profileIds);
    return groupBy(
      records,
      (record) => record.profileId,
      ({ id, name, description, url, stack }): Project => ({ id, name, description, url, stack }),
    );
  }
}
