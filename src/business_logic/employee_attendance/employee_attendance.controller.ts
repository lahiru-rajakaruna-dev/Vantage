import {
    Controller,
    Get,
    Inject,
    Param,
    Req
}                                    from '@nestjs/common';
import type ILoggerService           from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY }     from '../../logger/logger_factory/logger_factory.service';
import { TOrganizationSelect }       from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import { BaseController }            from '../abstract.base.controller';
import { EmployeeAttendanceService } from './employee_attendance.service';



@Controller('employee-attendance')
export class EmployeeAttendanceController extends BaseController {
    private readonly employeeAttendanceService: EmployeeAttendanceService
    
    
    constructor(
        employeeAttendanceService: EmployeeAttendanceService,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService
    ) {
        super(logger)
        this.employeeAttendanceService = employeeAttendanceService
    }
    
    
    @Get('/:employee_id')
    async getEmployeeAttendance(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id')
        employee_id: string
    ) {
        
        const req_organization_id = this.validateOrganization(req)
        
        return this.employeeAttendanceService.getEmployeeAttendanceById(
            req_organization_id,
            employee_id
        )
    }
    
}
