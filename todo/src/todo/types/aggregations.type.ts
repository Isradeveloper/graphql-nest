import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType({ description: 'Todo quick aggregations' })
export class AggregationsType {
  @Field(() => Int, { description: 'Total de tareas' })
  total: number;

  @Field(() => Int, { description: 'Tareas pendientes' })
  pending: number;

  @Field(() => Int, { description: 'Tareas completadas' })
  completed: number;

  @Field(() => Int, {
    description: 'Total de tareas completadas',
    deprecationReason: 'most used completed instead',
  })
  totalTodosCompleted: number;
}
