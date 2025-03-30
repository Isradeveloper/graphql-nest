import { forwardRef, Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListResolver } from './list.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ListItemModule } from 'src/list-item/list-item.module';

@Module({
  imports: [PrismaModule, forwardRef(() => ListItemModule)],
  providers: [ListResolver, ListService],
  exports: [ListService],
})
export class ListModule {}
