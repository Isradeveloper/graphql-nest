import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  completed: boolean = false;

  @IsUUID()
  @Field(() => ID)
  listId: string;

  @IsUUID()
  @Field(() => ID)
  itemId: string;
}
