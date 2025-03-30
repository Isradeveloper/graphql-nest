import { forwardRef, Module } from '@nestjs/common';
import { ListItemService } from './list-item.service';
import { ListItemResolver } from './list-item.resolver';
import { ListModule } from 'src/list/list.module';
import { ItemsModule } from 'src/items/items.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [forwardRef(() => ListModule), ItemsModule, PrismaModule],
  providers: [ListItemResolver, ListItemService],
  exports: [ListItemService],
})
export class ListItemModule {}
