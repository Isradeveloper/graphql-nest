import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateListInput, UpdateListInput } from './dto/inputs';
import { PrismaService } from 'src/prisma/prisma.service';
import { List } from './entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createListInput: CreateListInput,
    userId: string,
  ): Promise<List> {
    return await this.prismaService.list.create({
      data: { ...createListInput, userId },
      include: { user: true },
    });
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const whereCondition: Prisma.ListWhereInput = {
      userId: user.id,
      ...(searchArgs.search
        ? { name: { contains: searchArgs.search, mode: 'insensitive' } }
        : {}),
    };

    return this.prismaService.list.findMany({
      where: whereCondition,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: paginationArgs.limit,
      skip: paginationArgs.offset,
    });
  }

  async findOne(id: string, userId: string): Promise<List> {
    const list = await this.prismaService.list.findUnique({
      where: { id, userId },
      include: { user: true },
    });
    if (!list) throw new BadRequestException('List not found');
    return list;
  }

  async update(
    updateListInput: UpdateListInput,
    userId: string,
  ): Promise<List> {
    await this.findOne(updateListInput.id, userId);
    const { id, ...toUpdate } = updateListInput;
    return this.prismaService.list.update({
      where: { id },
      data: toUpdate,
      include: { user: true },
    });
  }

  async remove(id: string, userId: string): Promise<List> {
    const list = await this.findOne(id, userId);

    await this.prismaService.list.delete({
      where: { id },
      select: { id: true },
    });

    return list;
  }
}
