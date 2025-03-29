import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class Item {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Float)
  quantity: number;

  @Field(() => String)
  quantityUnits: string; // g, ml, kg, tsp
}
