import {
    Controller,
    Get,
    Param,
    Req,
    UnauthorizedException
}                                    from '@nestjs/common';
import { TOrganizationSelect }       from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import { EmployeeAttendanceService } from './employee_attendance.service';



@Controller('employee-attendance')
export class EmployeeAttendanceController {
    private readonly employeeAttendanceService: EmployeeAttendanceService
    
    
    constructor(employeeAttendanceService: EmployeeAttendanceService) {
        this.employeeAttendanceService = employeeAttendanceService
    }
    
    
    @Get('/:employee_id')
    async getEmployeeAttendance(
        @Req()
        request: Request & { organization: TOrganizationSelect },
        @Param('employee_id')
        employee_id: string
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Invalid request')
        }
        
        return this.employeeAttendanceService.getEmployeeAttendanceById(
            request.organization.organization_id,
            employee_id
        )
    }
    
}
