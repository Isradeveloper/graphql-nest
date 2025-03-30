import { join } from 'path';
import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { JwtService } from '@nestjs/jwt';
// import { JwtPayload } from './auth/interfaces/jtw-payload.interface';
// import { IncomingHttpHeaders } from 'http';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListModule } from './list/list.module';
import { ListItemModule } from './list-item/list-item.module';
import { DateScalar } from './common/scalars/datetime.scalar';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // * Configuración de GraphQL con JWT
    // GraphQLModule.forRootAsync({
    //   driver: ApolloDriver,
    //   imports: [AuthModule],
    //   inject: [JwtService],
    //   useFactory: async (jwtService: JwtService) => ({
    //     autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //     playground: false,
    //     plugins: [ApolloServerPluginLandingPageLocalDefault()],
    //     context({ req }: { req: { headers: IncomingHttpHeaders } }) {
    //       const token = req.headers.authorization?.replace('Bearer ', '');
    //       if (!token) throw Error('Token needed');
    //       const payload = jwtService.decode<JwtPayload>(token);
    //       if (!payload) throw Error('Token not valid');
    //     },
    //   }),
    // }),

    // * Configuración básica de GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ItemsModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListModule,
    ListItemModule,
  ],
  controllers: [],
  providers: [DateScalar],
})
export class AppModule {}
