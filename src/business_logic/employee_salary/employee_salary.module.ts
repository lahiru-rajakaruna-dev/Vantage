import { Module }                   from '@nestjs/common';
import { LoggerModule }             from '../../logger/logger.module';
import { OrmModule }                from '../../orm/orm.module';
import { EmployeeSalaryController } from './employee_salary.controller';
import { EmployeeSalaryService }    from './employee_salary.service';



@Module({
            imports    : [
                LoggerModule,
                OrmModule
            ],
            providers  : [ EmployeeSalaryService ],
            controllers: [ EmployeeSalaryController ]
        })
export class EmployeeSalaryModule {
}
