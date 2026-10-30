import { Injectable, NotFoundException } from '@nestjs/common';
import { groupBy } from '../common/group-by';
import type { Link } from './link.model';
import type { Profile } from './profile.model';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  async getProfile(): Promise<Profile> {
    const record = await this.repository.findMain();
    if (!record) {
      throw new NotFoundException('Profile not found: the database has not been seeded');
    }
    const { id, name, title, description, location } = record;
    return { id, name, title, description, location };
  }

  /** Ссылки, сгруппированные по id профиля. */
  async getLinksByProfileIds(profileIds: readonly number[]): Promise<Map<number, Link[]>> {
    const records = await this.repository.findLinksByProfileIds(profileIds);
    return groupBy(
      records,
      (record) => record.profileId,
      ({ id, label, url }): Link => ({ id, label, url }),
    );
  }
}
