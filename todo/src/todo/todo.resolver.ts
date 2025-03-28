import { Query, Resolver, Int, Args, Mutation } from '@nestjs/graphql';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';
import { UpdateTodoInput, CreateTodoInput } from './dtos/inputs';
import { StatusArgs } from './dtos/args/status.args';
import { AggregationsType } from './types/aggregations.type';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => [Todo], { name: 'todos', description: 'Lista de tareas' })
  findAll(@Args() statusArgs: StatusArgs): Todo[] {
    return this.todoService.findAll(statusArgs);
  }

  @Query(() => Todo, {
    name: 'todo',
    description: 'Obtiene una tarea por su ID',
  })
  findOne(
    @Args('id', { type: () => Int, description: 'ID de la tarea' }) id: number,
  ) {
    return this.todoService.findOne(id);
  }

  @Mutation(() => Todo, {
    name: 'createTodo',
    description: 'Crea una nueva tarea',
  })
  createTodo(@Args('createTodoInput') createTodoInput: CreateTodoInput) {
    return this.todoService.create(createTodoInput);
  }

  @Mutation(() => Todo, {
    name: 'updateTodo',
    description: 'Actualiza una tarea',
  })
  updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    return this.todoService.update(updateTodoInput);
  }

  @Mutation(() => Boolean)
  removeTodo(
    @Args('id', { type: () => Int, description: 'ID de la tarea' }) id: number,
  ) {
    return this.todoService.delete(id);
  }

  // Aggregations
  @Query(() => Int, {
    name: 'totalTodos',
    description: 'Total de tareas',
  })
  totalTodos(): number {
    return this.todoService.totalTodos;
  }

  // @Query(() => Int, {
  //   name: 'completedTodos',
  //   description: 'Tareas completadas',
  // })
  // completedTodos(): number {
  //   return this.todoService.completedTodos;
  // }

  // @Query(() => Int, {
  //   name: 'pendingTodos',
  //   description: 'Tareas pendientes',
  // })
  // pendingTodos(): number {
  //   return this.todoService.pendingTodos;
  // }

  @Query(() => AggregationsType, {
    name: 'aggregations',
    description: 'Tareas completadas',
  })
  aggregations(): AggregationsType {
    return {
      total: this.todoService.totalTodos,
      pending: this.todoService.pendingTodos,
      completed: this.todoService.completedTodos,
      totalTodosCompleted: this.todoService.totalTodos,
    };
  }
}
