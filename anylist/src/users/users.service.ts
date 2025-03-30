import { BadRequestException, Injectable, Logger } from '@nestjs/common';
// import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpInput } from 'src/auth/dto/inputs';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { PaginationArgs } from 'src/common/dto/args';
import { SearchArgs } from '../common/dto/args/search.args';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(signupInput: SignUpInput): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          ...signupInput,
          password: bcrypt.hashSync(signupInput.password, 10),
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002' && error.meta?.target) {
          throw new BadRequestException(
            `Unique constraint failed on the fields: ${JSON.stringify(error.meta.target)}`,
          );
        }
      }
      this.logger.error('Error creating user', error);
      throw new Error('Error creating user');
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email },
      include: { lastUpdateBy: true },
    });
  }

  async findOneByID(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id },
      include: { lastUpdateBy: true },
    });
    if (!user) throw new BadRequestException(`User with id ${id} not found`);
    return user;
  }

  async findAll(
    roles: ValidRoles[],
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<User[]> {
    const whereCondition: Prisma.UserWhereInput = {
      AND: [
        searchArgs.search
          ? {
              OR: [
                {
                  fullName: {
                    contains: searchArgs.search,
                    mode: 'insensitive',
                  },
                },
                { email: { contains: searchArgs.search, mode: 'insensitive' } },
              ],
            }
          : {},
        roles.length > 0 && roles ? { roles: { hasSome: roles } } : {},
      ],
    };

    return this.prisma.user.findMany({
      where: whereCondition,
      include: { lastUpdateBy: true },
      orderBy: { createdAt: 'desc' },
      take: paginationArgs.limit,
      skip: paginationArgs.offset,
    });
  }

  async toggleBlock(id: string, user: User): Promise<User> {
    const userToBlock = await this.findOneByID(id);

    if (userToBlock.id === user.id) {
      throw new BadRequestException('You cannot block yourself');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: !userToBlock.isActive, lastUpdateById: user.id },
      include: { lastUpdateBy: true },
    });
  }

  async update(updateUserInput: UpdateUserInput, user: User): Promise<User> {
    const { id, ...toUpdate } = updateUserInput;
    await this.findOneByID(id);

    if (toUpdate.password) {
      toUpdate.password = bcrypt.hashSync(toUpdate.password, 10);
    }

    if (toUpdate.email) {
      const existingUser = await this.findOneByEmail(toUpdate.email);
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException(`Email already exists`);
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: { ...toUpdate, lastUpdateById: user.id },
      include: { lastUpdateBy: true },
    });
  }
}
