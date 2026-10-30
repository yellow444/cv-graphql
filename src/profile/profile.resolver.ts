import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Experience } from '../experience/experience.model';
import { Loaders, type DataLoaders } from '../loaders/data-loaders';
import { Project } from '../projects/project.model';
import { Skill, SkillCategory } from '../skills/skill.model';
import { SkillsService } from '../skills/skills.service';
import { Link } from './link.model';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';

/**
 * Резолвер отвечает только за GraphQL: корневой запрос и вложенные поля профиля.
 * Вложенные поля грузятся через DataLoader, поэтому глубина запроса не множит SQL-запросы.
 */
@Resolver(() => Profile)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly skillsService: SkillsService,
  ) {}

  @Query(() => Profile, { description: 'Профиль кандидата со всеми разделами визитки' })
  profile(): Promise<Profile> {
    return this.profileService.getProfile();
  }

  @ResolveField(() => [Link], { description: 'GitHub, статьи и другие ресурсы' })
  links(@Parent() profile: Profile, @Loaders() loaders: DataLoaders): Promise<Link[]> {
    return loaders.linksByProfileId.load(profile.id);
  }

  @ResolveField(() => [Skill], { description: 'Навыки, можно отфильтровать по группе' })
  async skills(
    @Parent() profile: Profile,
    @Loaders() loaders: DataLoaders,
    @Args('category', { type: () => SkillCategory, nullable: true }) category?: SkillCategory,
  ): Promise<Skill[]> {
    const skills = await loaders.skillsByProfileId.load(profile.id);
    return this.skillsService.filterByCategory(skills, category);
  }

  @ResolveField(() => [Experience], { description: 'Опыт работы, сначала последние места' })
  experience(@Parent() profile: Profile, @Loaders() loaders: DataLoaders): Promise<Experience[]> {
    return loaders.experienceByProfileId.load(profile.id);
  }

  @ResolveField(() => [Project], { description: 'Проекты и статьи' })
  projects(@Parent() profile: Profile, @Loaders() loaders: DataLoaders): Promise<Project[]> {
    return loaders.projectsByProfileId.load(profile.id);
  }
}
