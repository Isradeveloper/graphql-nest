import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput, UpdateTodoInput } from './dtos/inputs';
import { StatusArgs } from './dtos/args/status.args';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, description: 'Tarea 1', done: false },
    { id: 2, description: 'Tarea 2', done: false },
    { id: 3, description: 'Tarea 3', done: false },
  ];

  get totalTodos() {
    return this.todos.length;
  }

  get completedTodos() {
    return this.todos.filter((todo) => todo.done).length;
  }

  get pendingTodos() {
    return this.todos.filter((todo) => !todo.done).length;
  }

  findAll(statusArgs: StatusArgs): Todo[] {
    const { status } = statusArgs;
    return status !== undefined
      ? this.todos.filter((todo) => todo.done === status)
      : this.todos;
  }

  findOne(id: number) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    return todo;
  }

  create({ description }: CreateTodoInput): Todo {
    const newTodo = {
      id: Math.max(...this.todos.map((todo) => todo.id), 0) + 1,
      description,
      done: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  update({ id, description, done }: UpdateTodoInput): Todo {
    const todoToUpdate = this.findOne(id);

    if (description) todoToUpdate.description = description;
    if (done !== undefined) todoToUpdate.done = done;

    this.todos = this.todos.map((todo) =>
      todo.id === id ? todoToUpdate : todo,
    );

    return todoToUpdate;
  }

  delete(id: number): boolean {
    const todo = this.findOne(id);
    this.todos = this.todos.filter((item) => item.id !== todo.id);
    return true;
  }
}
