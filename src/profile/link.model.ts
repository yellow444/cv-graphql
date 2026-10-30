import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Ссылка на внешний ресурс: GitHub, статья, канал' })
export class Link {
  @Field(() => ID)
  id!: number;

  @Field()
  label!: string;

  @Field()
  url!: string;
}
