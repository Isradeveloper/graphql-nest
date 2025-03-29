import { InputType, Float, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateItemInput {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @Field(() => String, { description: 'Item name' })
  name: string;

  @IsNumber()
  @IsPositive()
  @Field(() => Float, { description: 'Item quantity' })
  quantity: number;

  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @Field(() => String, { description: 'Item quantity units' })
  quantityUnits: string; // g, ml, kg, tsp
}
