import { Module } from '@nestjs/common';
import { SalesGroupController } from './sales_group.controller';
import { SalesGroupService } from './sales_group.service';
import { OrmModule } from '../../orm/orm.module';

@Module({
  imports: [OrmModule],
  controllers: [SalesGroupController],
  providers: [SalesGroupService],
})
export class SalesGroupModule {}
