import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {
  @Query(() => String, { name: 'hello', description: 'Saluda al mundo' })
  helloWorld(): string {
    return '¡Hola mundo!';
  }

  @Query(() => Float, {
    name: 'random',
    description: 'Genera un número aleatorio',
  })
  getRandomNumber(): number {
    return Math.random() * 100;
  }

  @Query(() => Int, {
    name: 'randomFromZeroTo',
    description: 'Genera un número aleatorio entre 0 y el valor máximo',
  })
  getRandomFromZeroTo(
    @Args('to', { nullable: true, type: () => Int }) max: number = 10,
  ): number {
    return Math.floor(Math.random() * (max - 0 + 1) + 0);
  }
}
