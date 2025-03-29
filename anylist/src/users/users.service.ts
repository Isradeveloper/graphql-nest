import { BadRequestException, Injectable, Logger } from '@nestjs/common';
// import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpInput } from 'src/auth/dto/inputs';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
    return this.prisma.user.findFirst({ where: { email } });
  }

  async findOneByID(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) throw new BadRequestException(`User with id ${id} not found`);
    return user;
  }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  // async block(id: string): Promise<User> {
  //   throw new Error(`This action removes a #${id} user`);
  // }
}
