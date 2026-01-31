import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UnauthorizedException,
    UsePipes,
}                              from '@nestjs/common';
import { TOrganization }       from '../../orm/orm.interface';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import {
    CreateEmployeesCredentialsRequestSchema,
    type TEmployee,
    UpdateEmployeeRequestSchema,
}                              from '../../schemas';
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
            organization: TOrganization
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
            organization: TOrganization
        },
        @Param('sales_group_id') sales_group_id: string,
    ) {
        if (!request.organization) {
            return new UnauthorizedException('Organization not found')
        }
        
        return await this.employeesService.getEmployeesBySalesGroupId(
            request.organization.organization_id,
            sales_group_id,
        );
    }
    
    
    @Get('/view/:employee_id')
    async getEmployeeById(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('employee_id') employee_id: string,
    ) {
        if (!request.organization) {
            return new UnauthorizedException('Organization not found')
        }
        
        return await this.employeesService.viewEmployeeById(
            request.organization.organization_id,
            employee_id,
        );
    }
    
    
    @Post()
    @UsePipes(new ZodSchemaValidationPipe(
        CreateEmployeesCredentialsRequestSchema))
    async addEmployee(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Body() employeeData: {
            employee_nic_number: string,
            employee_password: string
        },
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        const {
                  employee_nic_number,
                  employee_password
              } = employeeData;
        
        return await this.employeesService.addEmployee(
            request.organization.organization_id,
            {
                employee_nic_number: employee_nic_number,
                employee_password  : employee_password
            }
        );
    }
    
    
    @Patch('/update/name/:employee_id')
    @UsePipes(
        new ZodSchemaValidationPipe(
            UpdateEmployeeRequestSchema.pick({
                                                 employee_first_name: true,
                                                 employee_last_name : true
                                             })
        ),
    )
    async updateEmployeeName(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('employee_id') employee_id: string,
        @Body() employeeData: {
            employee_first_name: string,
            employee_last_name: string
        },
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
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
            UpdateEmployeeRequestSchema.pick({ employee_nic_number: true })
        ),
    )
    async updateEmployeeNic(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('employee_id') employee_id: string,
        @Body() employeeData: Pick<TEmployee, 'employee_nic_number'>,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
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
            UpdateEmployeeRequestSchema.pick({ employee_phone: true })
        ),
    )
    async updateEmployeePhone(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('employee_id') employee_id: string,
        @Body() employeeData: {
            employee_phone: string
        },
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
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
            UpdateEmployeeRequestSchema.pick({ employee_sales_group_id: true })
        ),
    )
    async addEmployeesToSalesGroup(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('employees_ids') employees_ids: string[],
        @Body() employeeData: Pick<TEmployee, 'employee_sales_group_id'>,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        if (!employeeData.employee_sales_group_id) {
            throw new BadRequestException('Missing required data')
        }
        
        return await this.employeesService.addEmployeesToSalesGroupByIds(
            request.organization.organization_id,
            employees_ids,
            employeeData.employee_sales_group_id,
        );
    }
    
    
    @Patch('/update/remove-from-sales-group/')
    async removeEmployeesFromSalesGroup(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('employees_ids') employees_ids: string[],
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.employeesService.removeEmployeesFromSalesGroup(
            request.organization.organization_id,
            employees_ids,
        );
    }
    
    
    @Delete('/delete/:employee_id')
    async deleteEmployee(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('employee_id') employee_id: string,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.employeesService.deleteEmployeeById(
            request.organization.organization_id,
            employee_id,
        );
    }
    
    
    @Delete('/suspend')
    async suspendEmployees(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Query('employees_ids') employees_ids: string[],
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return employees_ids.map(async (employee_id) => {
            return await this.employeesService.deleteEmployeeById(
                request.organization.organization_id,
                employee_id,
            );
        });
    }
}
