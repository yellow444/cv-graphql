import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Link, Profile } from '../generated/prisma/client';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  const repository = {
    findMain: jest.fn<Promise<Profile | null>, []>(),
    findLinksByProfileIds: jest.fn<Promise<Link[]>, [readonly number[]]>(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [ProfileService, { provide: ProfileRepository, useValue: repository }],
    }).compile();
    service = moduleRef.get(ProfileService);
  });

  it('returns the profile without storage fields', async () => {
    repository.findMain.mockResolvedValue({
      id: 1,
      slug: 'someone',
      name: 'Name',
      title: 'Developer',
      description: 'About',
      location: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(service.getProfile()).resolves.toEqual({
      id: 1,
      name: 'Name',
      title: 'Developer',
      description: 'About',
      location: null,
    });
  });

  it('throws NotFoundException when the database is empty', async () => {
    repository.findMain.mockResolvedValue(null);

    await expect(service.getProfile()).rejects.toBeInstanceOf(NotFoundException);
  });

  it('groups links by profile', async () => {
    repository.findLinksByProfileIds.mockResolvedValue([
      { id: 1, profileId: 1, label: 'GitHub', url: 'https://github.com/x', sortOrder: 0 },
    ]);

    const result = await service.getLinksByProfileIds([1, 2]);

    expect(result.get(1)).toEqual([{ id: 1, label: 'GitHub', url: 'https://github.com/x' }]);
    expect(result.has(2)).toBe(false);
  });
});
