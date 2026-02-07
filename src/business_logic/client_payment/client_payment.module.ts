import { Module }                  from '@nestjs/common';
import { LoggerModule }            from '../../logger/logger.module';
import { OrmModule }               from '../../orm/orm.module';
import { ClientPaymentController } from './client_payment.controller';
import { ClientPaymentService }    from './client_payment.service';



@Module({
            imports    : [
                OrmModule,
                LoggerModule
            ],
            providers  : [ ClientPaymentService ],
            controllers: [ ClientPaymentController ],
        })
export class ClientPaymentModule {
}
