import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Профиль кандидата' })
export class Profile {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field({ description: 'Должность или специализация' })
  title!: string;

  @Field({ description: 'Краткое описание' })
  description!: string;

  @Field(() => String, { nullable: true })
  location!: string | null;
}
