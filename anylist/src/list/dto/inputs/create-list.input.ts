import { InputType, Field } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class CreateListInput {
  @Field(() => String, { description: 'Name of the list' })
  @MinLength(3)
  name: string;
}
