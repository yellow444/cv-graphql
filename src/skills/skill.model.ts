import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SkillCategory } from '../generated/prisma/enums';

registerEnumType(SkillCategory, {
  name: 'SkillCategory',
  description: 'Группа навыков',
  valuesMap: {
    BACKEND: { description: 'Бэкенд и языки' },
    FRONTEND: { description: 'Фронтенд' },
    DATA: { description: 'Данные, ETL и очереди' },
    DATABASES: { description: 'Базы данных' },
    DEVOPS: { description: 'DevOps и инфраструктура' },
    AI: { description: 'LLM и AI-инструменты' },
    INTEGRATIONS: { description: 'Интеграции с госсистемами' },
  },
});

export { SkillCategory };

@ObjectType({ description: 'Навык' })
export class Skill {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field(() => SkillCategory)
  category!: SkillCategory;

  @Field(() => String, { nullable: true, description: 'Где и сколько использовал' })
  note!: string | null;
}
