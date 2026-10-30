import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Loaders, type DataLoaders } from '../loaders/data-loaders';
import { Experience } from './experience.model';

@Resolver(() => Experience)
export class ExperienceResolver {
  @ResolveField(() => [String], { description: 'Достижения на этом месте работы' })
  achievements(
    @Parent() experience: Experience,
    @Loaders() loaders: DataLoaders,
  ): Promise<string[]> {
    return loaders.achievementsByExperienceId.load(experience.id);
  }
}
