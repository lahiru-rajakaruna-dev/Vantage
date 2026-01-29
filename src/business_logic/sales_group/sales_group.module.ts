import { Module } from '@nestjs/common';
import { OrmModule } from '../../orm/orm.module';
import { SalesGroupController } from './sales_group.controller';
import { SalesGroupService } from './sales_group.service';

@Module({
  imports: [OrmModule],
  controllers: [SalesGroupController],
  providers: [SalesGroupService],
})
export class SalesGroupModule {}
