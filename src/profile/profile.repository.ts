import { Injectable } from '@nestjs/common';
import type { Link as LinkRecord, Profile as ProfileRecord } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Визитка одного человека: берём первый профиль. */
  findMain(): Promise<ProfileRecord | null> {
    return this.prisma.profile.findFirst({ orderBy: { id: 'asc' } });
  }

  findLinksByProfileIds(profileIds: readonly number[]): Promise<LinkRecord[]> {
    return this.prisma.link.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
