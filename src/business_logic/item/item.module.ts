import { Module }         from '@nestjs/common';
import { OrmModule }      from 'src/orm/orm.module';
import { LoggerModule }   from '../../logger/logger.module';
import { ItemController } from './item.controller';
import { ItemService }    from './item.service';



@Module({
            imports    : [
                OrmModule,
                LoggerModule
            ],
            controllers: [ ItemController ],
            providers  : [ ItemService ],
        })
export class ItemModule {
}
