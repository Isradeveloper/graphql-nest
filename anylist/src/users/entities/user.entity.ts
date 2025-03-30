import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from '../../items/entities/item.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  fullName: string;

  @Field(() => String)
  email: string;

  // @Field(() => String)
  password: string;

  @Field(() => [String])
  roles: string[];

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => User, { nullable: true })
  lastUpdateBy?: User | null;

  // @Field(() => [Item], { nullable: true })
  items?: Item[];
}
