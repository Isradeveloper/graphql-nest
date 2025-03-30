import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd)
      throw new UnauthorizedException(
        'No se puede ejecutar el seed en producción',
      );

    // Limpiar la base de datos
    await this.deleteDatabase();

    // Crear usuarios
    const users = await this.createUsers();

    // Crear items para cada usuario
    await this.createItems(users);

    return true;
  }

  async deleteDatabase() {
    await this.prismaService.item.deleteMany({});
    await this.prismaService.user.deleteMany({});
  }

  async createUsers(): Promise<User[]> {
    const users = await this.prismaService.user.createManyAndReturn({
      data: SEED_USERS.map((user) => {
        return {
          ...user,
          password: bcrypt.hashSync(user.password, 10),
          email: user.email.toLowerCase(),
        };
      }),
    });
    return users;
  }

  async createItems(users: User[]): Promise<void> {
    const itemsToCreate = SEED_ITEMS.map(({ name, quantityUnits }) => ({
      name,
      quantityUnits,
      quantity: this.ramdomNumber(1, 10),
      userId: users[this.ramdomNumber(0, users.length - 1)].id,
    }));

    await this.prismaService.item.createMany({
      data: itemsToCreate,
      skipDuplicates: true,
    });
  }

  ramdomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
