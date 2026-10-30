import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Место работы' })
export class Experience {
  @Field(() => ID)
  id!: number;

  @Field()
  company!: string;

  @Field()
  position!: string;

  @Field(() => String, { nullable: true, description: 'Чем занималась компания или команда' })
  summary!: string | null;

  @Field({ description: 'Начало в ISO 8601: "2021-09" или "2023", если месяц неизвестен' })
  startDate!: string;

  @Field(() => String, { nullable: true, description: 'Окончание. null, если дата не указана' })
  endDate!: string | null;

  @Field({ description: 'Период для показа: "09.2021 - 10.2026" или "с 09.2021"' })
  period!: string;
}
