import { IsUUID } from 'class-validator';
import { CreateListItemInput } from './create-list-item.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateListItemInput extends PartialType(CreateListItemInput) {
  @IsUUID()
  @Field(() => ID)
  id: string;
}
