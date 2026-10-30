import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Проект' })
export class Project {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => String, {
    nullable: true,
    description: 'Ссылка на проект или репозиторий. null, если код закрыт',
  })
  url!: string | null;

  @Field(() => [String], { description: 'Технологии проекта' })
  stack!: string[];
}
