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
}                                from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import ZodSchemaValidationPipe   from '../../pipes/schema_validation.pipe';
import { BaseController }        from '../abstract.base.controller';
import { EmployeeService }       from './employee.service';



@Controller('employee')
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
            organization: TOrganizationSelect
        },) {
        
        const req_organization_id = this.validateOrganization(req)
        return await this.employeesService.getEmployeesByOrganizationId(req_organization_id);
    }
    
    
    @Get('/sales-group/:sales_group_id')
    async getEmployeesByGroupId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('sales_group_id')
        sales_group_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.employeesService.getEmployeesBySalesGroupId(
            req_organization_id,
            sales_group_id,
        );
    }
    
    
    @Get('/:employee_id')
    async getEmployeeById(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
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
            organization: TOrganizationSelect
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
    
    
    @Patch('/update/name/:employee_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaEmployeeUpdate.pick({
                                                                        employee_first_name: true,
                                                                        employee_last_name : true
                                                                    })
                                                              .nonoptional()),)
    async updateEmployeeName(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id')
        employee_id: string,
        @Body()
        employeeData: Pick<TEmployeeUpdate, 'employee_first_name' | 'employee_last_name'>,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!employeeData.employee_first_name || !employeeData.employee_last_name) {
            throw new BadRequestException('Missing required data...')
        }
        
        return await this.employeesService.updateEmployeeUsernameById(
            req_organization_id,
            employee_id,
            employeeData.employee_first_name,
            employeeData.employee_last_name
        );
    }
    
    
    @Patch('/update/nic/:employee_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaEmployeeUpdate.pick({
                                                                        employee_nic_number: true
                                                                    })
                                                              .nonoptional()),)
    async updateEmployeeNic(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id')
        employee_id: string,
        @Body()
        employeeData: Pick<TEmployeeUpdate, 'employee_nic_number'>,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!employeeData.employee_nic_number) {
            throw new BadRequestException('Missing required data...')
        }
        
        return await this.employeesService.updateEmployeeNICById(
            req_organization_id,
            employee_id,
            employeeData.employee_nic_number,
        );
    }
    
    
    @Patch('/update/phone/:employee_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaEmployeeUpdate.pick({ employee_phone: true })
                                                              .nonoptional()),)
    async updateEmployeePhone(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id')
        employee_id: string,
        @Body()
        employeeData: Pick<TEmployeeUpdate, 'employee_phone'>,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!employeeData.employee_phone) {
            throw new BadRequestException('Missing required data...')
        }
        
        return await this.employeesService.updateEmployeePhoneById(
            req_organization_id,
            employee_id,
            employeeData.employee_phone,
        );
    }
    
    
    @Patch('/update/add-to-sales-group/')
    @UsePipes(new ZodSchemaValidationPipe(SchemaEmployeeUpdate.pick({
                                                                        employee_sales_group_id: true
                                                                    })
                                                              .nonoptional()),)
    async addEmployeesToSalesGroup(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Body()
        employeeData: Pick<TEmployeeUpdate, 'employee_sales_group_id'> & {
            employees_ids: string[]
        },
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!employeeData.employee_sales_group_id) {
            throw new BadRequestException('Missing required data')
        }
        
        return await this.employeesService.addEmployeesToSalesGroupByIds(
            req_organization_id,
            employeeData.employees_ids,
            employeeData.employee_sales_group_id,
        );
    }
    
    
    @Patch('/update/remove-from-sales-group/')
    async removeEmployeesFromSalesGroup(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Body('employees_ids')
        employees_ids: string[],
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.employeesService.removeEmployeesFromSalesGroup(
            req_organization_id,
            employees_ids,
        );
    }
    
    
    @Patch('/fire/:employee_id')
    async fireEmployee(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id')
        employee_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.employeesService.fireEmployee(
            req_organization_id,
            employee_id,
        );
    }
    
    
    @Patch('/suspend/:employee_id')
    async suspendEmployee(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id')
        employee_id: string,
    ) {
        
        const req_organization_id = this.validateOrganization(req)
        return await this.employeesService.suspendEmployee(
            req_organization_id,
            employee_id,
        );
    }
}
