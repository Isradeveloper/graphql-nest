import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListService } from 'src/list/list.service';
import { ItemsService } from 'src/items/items.service';
import { CreateListItemInput } from './dto/inputs';
import { User } from 'src/users/entities/user.entity';
import { ListItem } from './entities/list-item.entity';
import { PaginationArgs } from 'src/common/dto/args';
import { List } from 'src/list/entities/list.entity';

@Injectable()
export class ListItemService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly listService: ListService,
    private readonly itemsService: ItemsService,
  ) {}

  async create(
    createListItemInput: CreateListItemInput,
    user: User,
  ): Promise<ListItem> {
    const { listId, itemId, ...rest } = createListItemInput;

    await this.listService.findOne(listId, user.id);
    await this.itemsService.findOne(itemId, user);

    const newListItem = await this.prismaService.itemList.create({
      data: {
        ...rest,
        listId,
        itemId,
      },
    });

    return newListItem;
  }

  async findAll(list: List, paginationArgs: PaginationArgs, user: User) {
    await this.listService.findOne(list.id, user.id);

    return await this.prismaService.itemList.findMany({
      where: { list: { userId: user.id } },
      orderBy: { createdAt: 'desc' },
      take: paginationArgs.limit,
      skip: paginationArgs.offset,
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} listItem`;
  // }

  // update(id: number, updateListItemInput: UpdateListItemInput) {
  //   return `This action updates a #${id} listItem`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} listItem`;
  // }
}
