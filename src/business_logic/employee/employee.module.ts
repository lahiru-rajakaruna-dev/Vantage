import { Module }             from '@nestjs/common';
import { OrmModule }          from 'src/orm/orm.module';
import { LoggerModule }       from '../../logger/logger.module';
import { EmployeeController } from './employee.controller';
import { EmployeeService }    from './employee.service';



@Module({
            imports    : [
                OrmModule,
                LoggerModule
            ],
            controllers: [ EmployeeController ],
            providers  : [ EmployeeService ],
        })
export class EmployeeModule {
}
