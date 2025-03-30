import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class List {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  // @Field(() => User)
  user: User;
}
