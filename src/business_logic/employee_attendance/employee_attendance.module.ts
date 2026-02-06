import { Module }                       from '@nestjs/common';
import { LoggerModule }                 from '../../logger/logger.module';
import { OrmModule }                    from '../../orm/orm.module';
import { EmployeeAttendanceController } from './employee_attendance.controller';
import { EmployeeAttendanceService }    from './employee_attendance.service';



@Module({
            imports    : [
                OrmModule,
                LoggerModule
            ],
            controllers: [ EmployeeAttendanceController ],
            providers  : [ EmployeeAttendanceService ]
        })
export class EmployeeAttendanceModule {
}
