import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type DataLoader from 'dataloader';
import type { Experience } from '../experience/experience.model';
import type { Link } from '../profile/link.model';
import type { Project } from '../projects/project.model';
import type { Skill } from '../skills/skill.model';

/** Загрузчики одного GraphQL-запроса. Ключ - id родителя, значение - список дочерних записей. */
export interface DataLoaders {
  linksByProfileId: DataLoader<number, Link[]>;
  skillsByProfileId: DataLoader<number, Skill[]>;
  experienceByProfileId: DataLoader<number, Experience[]>;
  achievementsByExperienceId: DataLoader<number, string[]>;
  projectsByProfileId: DataLoader<number, Project[]>;
}

export interface GraphQLContext {
  loaders: DataLoaders;
}

/** Достаёт загрузчики текущего запроса из GraphQL-контекста: `@Loaders() loaders: DataLoaders`. */
export const Loaders = createParamDecorator(
  (_data: unknown, context: ExecutionContext): DataLoaders =>
    GqlExecutionContext.create(context).getContext<GraphQLContext>().loaders,
);
