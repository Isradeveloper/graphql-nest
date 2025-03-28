import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class UpdateTodoInput {
  @Field(() => Int, {
    description: 'ID de la tarea',
  })
  @IsInt()
  @Min(1)
  id: number;

  @Field(() => String, {
    description: 'Descripción de la tarea',
    nullable: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @IsOptional()
  description?: string;

  @Field(() => Boolean, {
    description: 'Indica si la tarea está completada',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
