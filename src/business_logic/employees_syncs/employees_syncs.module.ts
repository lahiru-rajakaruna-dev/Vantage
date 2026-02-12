import { Module }                   from '@nestjs/common';
import { LoggerModule }             from '../../logger/logger.module';
import { OrmModule }                from '../../orm/orm.module';
import { EmployeesSyncsController } from './employees_syncs.controller';
import { EmployeesSyncsService }    from './employees_syncs.service';



@Module({
            imports    : [
                LoggerModule,
                OrmModule
            ],
            providers  : [ EmployeesSyncsService ],
            exports    : [ EmployeesSyncsService ],
            controllers: [ EmployeesSyncsController ]
            
        })
export class EmployeesSyncsModule {
}
