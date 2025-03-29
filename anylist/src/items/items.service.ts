import { BadRequestException, Injectable } from '@nestjs/common';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    return this.prisma.item.create({ data: createItemInput });
  }

  async findAll(): Promise<Item[]> {
    return this.prisma.item.findMany();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });
    if (!item) {
      throw new BadRequestException(`Item with id ${id} not found`);
    }
    return item;
  }

  async update({ id, ...toUpdate }: UpdateItemInput): Promise<Item> {
    await this.findOne(id);
    return this.prisma.item.update({
      where: { id },
      data: toUpdate,
    });
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    const removed = await this.prisma.item.delete({
      where: { id },
    });
    return !!removed;
  }
}
