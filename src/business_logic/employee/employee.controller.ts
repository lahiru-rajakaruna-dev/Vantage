import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UnauthorizedException,
    UsePipes,
}                              from '@nestjs/common';
import {
    SchemaInsertEmployeeCredentials,
    SchemaUpdateEmployee,
    TEmployeeCredentialsInsert,
    TEmployeeUpdate,
    TOrganizationSelect
}                              from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import { EmployeeService }     from './employee.service';



@Controller('employee')
export class EmployeeController {
    private employeesService: EmployeeService;
    
    
    constructor(employeesService: EmployeeService) {
        this.employeesService = employeesService;
    }
    
    
    @Get('/view')
    async getAllEmployeesByOrganizationId(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.employeesService.getEmployeesByOrganizationId(
            request.organization.organization_id,
        );
    }
    
    
    @Get('/sales-group/:sales_group_id')
    async getEmployeesByGroupId(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('sales_group_id') sales_group_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.employeesService.getEmployeesBySalesGroupId(
            request.organization.organization_id,
            sales_group_id,
        );
    }
    
    
    @Get('/profile/:employee_id')
    async getEmployeeById(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id') employee_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.employeesService.getEmployeeProfile(
            request.organization.organization_id,
            employee_id,
        );
    }
    
    
    @Post()
    @UsePipes(
        new ZodSchemaValidationPipe(
            SchemaInsertEmployeeCredentials.pick({
                                                     employee_credential_username: true,
                                                     employee_credential_password: true
                                                 })
                                           .nonoptional()
        )
    )
    async addEmployee(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Body() employeeData: Pick<TEmployeeCredentialsInsert, 'employee_credential_username' | 'employee_credential_password'>,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        const {
                  employee_credential_username,
                  employee_credential_password
              } = employeeData;
        
        return await this.employeesService.addEmployee(
            request.organization.organization_id,
            {
                employee_credential_username,
                employee_credential_password
            }
        );
    }
    
    
    @Patch('/update/name/:employee_id')
    @UsePipes(
        new ZodSchemaValidationPipe(
            SchemaUpdateEmployee.pick({
                                          employee_first_name: true,
                                          employee_last_name : true
                                      })
                                .nonoptional()
        ),
    )
    async updateEmployeeName(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id') employee_id: string,
        @Body() employeeData: Pick<TEmployeeUpdate, 'employee_first_name' | 'employee_last_name'>,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        if (!employeeData.employee_first_name || !employeeData.employee_last_name) {
            throw new BadRequestException('Missing required data...')
        }
        
        return await this.employeesService.updateEmployeeUsernameById(
            request.organization.organization_id,
            employee_id,
            employeeData.employee_first_name,
            employeeData.employee_last_name
        );
    }
    
    
    @Patch('/update/nic/:employee_id')
    @UsePipes(
        new ZodSchemaValidationPipe(
            SchemaUpdateEmployee.pick({
                                          employee_nic_number: true
                                      })
                                .nonoptional()
        ),
    )
    async updateEmployeeNic(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id') employee_id: string,
        @Body() employeeData: Pick<TEmployeeUpdate, 'employee_nic_number'>,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        if (!employeeData.employee_nic_number) {
            throw new BadRequestException('Missing required data...')
        }
        
        return await this.employeesService.updateEmployeeNICById(
            request.organization.organization_id,
            employee_id,
            employeeData.employee_nic_number,
        );
    }
    
    
    @Patch('/update/phone/:employee_id')
    @UsePipes(
        new ZodSchemaValidationPipe(
            SchemaUpdateEmployee.pick({ employee_phone: true })
                                .nonoptional()
        ),
    )
    async updateEmployeePhone(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id') employee_id: string,
        @Body() employeeData: Pick<TEmployeeUpdate, 'employee_phone'>,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        if (!employeeData.employee_phone) {
            throw new BadRequestException('Missing required data...')
        }
        
        return await this.employeesService.updateEmployeePhoneById(
            request.organization.organization_id,
            employee_id,
            employeeData.employee_phone,
        );
    }
    
    
    @Patch('/update/add-to-sales-group/')
    @UsePipes(
        new ZodSchemaValidationPipe(
            SchemaUpdateEmployee.pick({
                                          employee_sales_group_id: true
                                      })
                                .nonoptional()
        ),
    )
    async addEmployeesToSalesGroup(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Body() employeeData: Pick<TEmployeeUpdate, 'employee_sales_group_id'> & {
            employees_ids: string[]
        },
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        if (!employeeData.employee_sales_group_id) {
            throw new BadRequestException('Missing required data')
        }
        
        return await this.employeesService.addEmployeesToSalesGroupByIds(
            request.organization.organization_id,
            employeeData.employees_ids,
            employeeData.employee_sales_group_id,
        );
    }
    
    
    @Patch('/update/remove-from-sales-group/')
    async removeEmployeesFromSalesGroup(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Body('employees_ids') employees_ids: string[],
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.employeesService.removeEmployeesFromSalesGroup(
            request.organization.organization_id,
            employees_ids,
        );
    }
    
    
    @Patch('/fire/:employee_id')
    async fireEmployee(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id') employee_id: string,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.employeesService.fireEmployee(
            request.organization.organization_id,
            employee_id,
        );
    }
    
    
    @Patch('/suspend/:employee_id')
    async suspendEmployee(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id') employee_id: string,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.employeesService.suspendEmployee(
            request.organization.organization_id,
            employee_id,
        );
    }
}
