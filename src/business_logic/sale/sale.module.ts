import { Module }         from '@nestjs/common';
import { LoggerModule }   from '../../logger/logger.module';
import { OrmModule }      from '../../orm/orm.module';
import { SaleController } from './sale.controller';
import { SaleService }    from './sale.service';



@Module({
            imports    : [
                OrmModule,
                LoggerModule
            ],
            providers  : [ SaleService ],
            controllers: [ SaleController ],
        })
export class SaleModule {
}
