import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Query,
    Req,
    UsePipes
}                                     from '@nestjs/common';
import type ILoggerService            from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY }      from '../../logger/logger_factory/logger_factory.service';
import {
    SchemaEmployeeActivityData,
    type   TEmployeeActivityData,
    type TOrganizationSelect
}                                     from '../../orm/drizzle/drizzle-postgres/schema';
import ZodSchemaValidationPipe        from '../../pipes/schema_validation.pipe';
import { BaseController }             from '../abstract.base.controller';
import { EmployeesActivitiesService } from './employees_activities.service';



@Controller('employees-activities')
export class EmployeesActivitiesController extends BaseController {
    private readonly employeeActivitiesService: EmployeesActivitiesService;
    
    
    constructor(
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService,
        employeeActivitiesService: EmployeesActivitiesService
    ) {
        super(logger)
        this.employeeActivitiesService = employeeActivitiesService
    }
    
    
    @Get('/:employee_id')
    async getEmployeeActivityProfile(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Param('employee_id')
        employee_id: string,
        @Query('start_date')
        start_date: string | undefined,
        @Query('end_date')
        end_date: string | undefined
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return this.employeeActivitiesService.getEmployeeActivityProfile(
            req_organization_id,
            employee_id,
            start_date
            ? parseInt(start_date)
            : undefined,
            end_date
            ? parseInt(end_date)
            : undefined
        )
    }
    
    
    @Post()
    @UsePipes(new ZodSchemaValidationPipe(SchemaEmployeeActivityData))
    async addEmployeeActivity(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Body()
        employeeActivityData: TEmployeeActivityData
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        const req_user_id = req.user_id
        
        return this.employeeActivitiesService.addEmployeeActivity(
            req_organization_id,
            req_user_id,
            employeeActivityData
        )
    }
}
