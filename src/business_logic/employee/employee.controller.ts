import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Req,
    UsePipes,
}                                from '@nestjs/common';
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import {
    SchemaEmployeeCredentialsData,
    SchemaEmployeeUpdate,
    type TEmployeeCredentialsData,
    type TEmployeeUpdate,
    type TOrganizationSelect
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import ZodSchemaValidationPipe   from '../../pipes/schema_validation.pipe';
import { BaseController }        from '../abstract.base.controller';
import { EmployeeService }       from './employee.service';



@Controller('employees')
export class EmployeeController extends BaseController {
    private employeesService: EmployeeService;
    
    
    constructor(
        employeesService: EmployeeService,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService
    ) {
        super(logger)
        this.employeesService = employeesService;
    }
    
    
    @Get('/')
    async getAllEmployeesByOrganizationId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },) {
        
        const req_organization_id = this.validateOrganization(req)
        return await this.employeesService.getEmployeesByOrganization(req_organization_id);
    }
    
    
    @Get('/sales-group/:sales_group_id')
    async getEmployeesByGroupId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Param('sales_group_id')
        sales_group_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.employeesService.getEmployeesBySalesGroup(
            req_organization_id,
            sales_group_id,
        );
    }
    
    
    @Get('/:employee_id')
    async getEmployeeById(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Param('employee_id')
        employee_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!employee_id) {
            throw new BadRequestException('Missing employee id')
        }
        
        return await this.employeesService.getEmployeeProfile(
            req_organization_id,
            employee_id,
        );
    }
    
    
    @Post()
    @UsePipes(new ZodSchemaValidationPipe(SchemaEmployeeCredentialsData))
    async addEmployee(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Body()
        employeeData: TEmployeeCredentialsData
    ) {
        const req_organization_id = this.validateOrganization(req)
        return await this.employeesService.addEmployee(
            req_organization_id,
            employeeData
        );
    }
    
    
    @Patch('/:employee_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaEmployeeUpdate))
    async updateEmployee(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Param('employee_id')
        employee_id: string,
        @Body()
        employeeData: TEmployeeUpdate,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.employeesService.updateEmployee(
            req_organization_id,
            employee_id,
            employeeData
        );
    }
}
