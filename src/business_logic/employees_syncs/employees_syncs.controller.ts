import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Patch,
    Req,
    UsePipes
}                                from '@nestjs/common';
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import {
    SchemaEmployeeSyncData,
    type   TEmployeeSyncUpdate,
    type TOrganizationSelect
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import ZodSchemaValidationPipe   from '../../pipes/schema_validation.pipe';
import { BaseController }        from '../abstract.base.controller';
import { EmployeesSyncsService } from './employees_syncs.service';



@Controller('employees-syncs')
export class EmployeesSyncsController extends BaseController {
    private readonly employeesSyncsService: EmployeesSyncsService;
    
    
    constructor(
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService,
        employeesSyncsService: EmployeesSyncsService
    ) {
        super(logger)
        this.employeesSyncsService = employeesSyncsService
    }
    
    
    @Get('/:employee_id')
    async getEmployeeSyncProfile(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Param('employee_id')
        employee_id: string
    ) {
        
        const req_organization_id = this.validateOrganization(req)
        
        if (!employee_id) {
            throw new BadRequestException('Employee id not found')
        }
        
        return this.employeesSyncsService.getEmployeeSyncProfile(
            req_organization_id,
            employee_id
        )
    }
    
    
    @Patch('/:employee_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaEmployeeSyncData))
    async updateEmployeeSyncProfile(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Param('employee_id')
        employee_id: string,
        @Body()
        employeeSyncUpdates: TEmployeeSyncUpdate
    ) {
        
        const req_organization_id = this.validateOrganization(req)
        
        if (!employee_id) {
            throw new BadRequestException('Employee id not found')
        }
        
        return this.employeesSyncsService.updateEmployeeSyncProfile(
            req_organization_id,
            employee_id,
            employeeSyncUpdates
        )
    }
}
