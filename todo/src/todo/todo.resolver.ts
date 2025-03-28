import { Query, Resolver, Int, Args, Mutation } from '@nestjs/graphql';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';
import { UpdateTodoInput, CreateTodoInput } from './dtos/inputs';

@Resolver()
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => [Todo], { name: 'todos', description: 'Lista de tareas' })
  findAll(): Todo[] {
    return this.todoService.findAll();
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
}
