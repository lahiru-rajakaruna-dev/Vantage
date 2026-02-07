import { Module }                        from '@nestjs/common';
import { LoggerModule }                  from '../../logger/logger.module';
import { OrmModule }                     from '../../orm/orm.module';
import { OrganizationPaymentController } from './organization-payment.controller';
import { OrganizationPaymentService }    from './organization-payment.service';



@Module({
            imports    : [
                OrmModule,
                LoggerModule
            ],
            controllers: [ OrganizationPaymentController ],
            providers  : [ OrganizationPaymentService ],
        })
export class OrganizationPaymentModule {
}
