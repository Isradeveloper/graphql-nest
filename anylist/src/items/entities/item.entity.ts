import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

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

  @Field(() => User, { nullable: true })
  user?: User; // User that created the item

  @Field(() => Date)
  createdAt: Date; // Date when the item was created

  @Field(() => Date)
  updatedAt: Date; // Date when the item was last updated
}
