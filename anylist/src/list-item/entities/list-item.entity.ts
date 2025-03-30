import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ListItem {
  @Field(() => ID)
  id: string;

  @Field(() => Number)
  quantity: number;

  @Field(() => Boolean)
  completed: boolean;

  listId: string;

  itemId: string;
}
