import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';
import { CreateListItemInput } from './dto/inputs';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from '../items/items.service';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(
    private readonly listItemService: ListItemService,
    private readonly itemsService: ItemsService,
  ) {}

  @Mutation(() => ListItem)
  async createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
    @CurrentUser() user: User,
  ) {
    return await this.listItemService.create(createListItemInput, user);
  }

  @ResolveField(() => Item, { name: 'item' })
  async getItem(@Parent() listItem: ListItem, @CurrentUser() user: User) {
    return await this.itemsService.findOne(listItem.itemId, user);
  }

  // @Query(() => [ListItem], { name: 'listItem' })
  // async findAll(
  //   @Args() paginationArgs: PaginationArgs,
  //   @CurrentUser() user: User,
  // ) {
  //   return await this.listItemService.findAll(paginationArgs, user);
  // }

  // @Query(() => ListItem, { name: 'listItem' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.findOne(id);
  // }

  // @Mutation(() => ListItem)
  // updateListItem(
  //   @Args('updateListItemInput') updateListItemInput: UpdateListItemInput,
  // ) {
  //   return this.listItemService.update(
  //     updateListItemInput.id,
  //     updateListItemInput,
  //   );
  // }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.remove(id);
  // }
}
