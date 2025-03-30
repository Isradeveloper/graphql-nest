import { BadRequestException, Injectable } from '@nestjs/common';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { SearchArgs, PaginationArgs } from 'src/common/dto/args';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = await this.prisma.item.create({
      data: { ...createItemInput, userId: user.id },
      include: { user: true },
    });

    return newItem;
  }

  async findAll(
    userId: string,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Item[]> {
    const whereCondition: Prisma.ItemWhereInput = {
      userId,
      ...(searchArgs.search
        ? { name: { contains: searchArgs.search, mode: 'insensitive' } }
        : {}),
    };

    return this.prisma.item.findMany({
      where: whereCondition,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: paginationArgs.limit,
      skip: paginationArgs.offset,
    });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.prisma.item.findUnique({
      where: { id, userId: user.id },
      include: { user: true },
    });
    if (!item) {
      throw new BadRequestException(`Item with id ${id} not found`);
    }
    return item;
  }

  async update(
    { id, ...toUpdate }: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    await this.findOne(id, user);
    return this.prisma.item.update({
      where: { id },
      include: { user: true },
      data: toUpdate,
    });
  }

  async remove(id: string, user: User): Promise<boolean> {
    await this.findOne(id, user);
    const removed = await this.prisma.item.delete({
      where: { id },
    });
    return !!removed;
  }

  async countItemsByUser(userId: string): Promise<number> {
    const count = await this.prisma.item.count({
      where: { userId },
    });
    return count;
  }
}
