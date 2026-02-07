import { Module }               from '@nestjs/common';
import { LoggerModule }         from '../../logger/logger.module';
import { OrmModule }            from '../../orm/orm.module';
import { SalesGroupController } from './sales_group.controller';
import { SalesGroupService }    from './sales_group.service';



@Module({
            imports    : [
                OrmModule,
                LoggerModule
            ],
            controllers: [ SalesGroupController ],
            providers  : [ SalesGroupService ],
        })
export class SalesGroupModule {
}
