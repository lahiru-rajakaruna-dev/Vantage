import { Module }                       from '@nestjs/common';
import { EmployeeAttendanceController } from './employee_attendance.controller';
import { EmployeeAttendanceService }    from './employee_attendance.service';



@Module({
            controllers: [ EmployeeAttendanceController ],
            providers  : [ EmployeeAttendanceService ]
        })
export class EmployeeAttendanceModule {
}
