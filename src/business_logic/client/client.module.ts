import { Module }           from '@nestjs/common';
import { LoggerModule }     from '../../logger/logger.module';
import { OrmModule }        from '../../orm/orm.module';
import { ClientController } from './client.controller';
import { ClientService }    from './client.service';



@Module({
            imports    : [
                OrmModule,
                LoggerModule
            ],
            providers  : [ ClientService ],
            controllers: [ ClientController ],
        })
export class ClientModule {
}
