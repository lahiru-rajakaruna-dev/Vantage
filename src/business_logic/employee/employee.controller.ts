import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { v4 as uuid } from 'uuid';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import { SchemaEmployee, type TEmployee } from '../../schemas';
import { z } from 'zod';

@Controller('employee')
export class EmployeeController {
  private employeesService: EmployeeService;
  constructor(employeesService: EmployeeService) {
    this.employeesService = employeesService;
  }

  @Get('/view')
  async getAllEmployeesByOrganizationId(
    @Headers('organization_id') organization_id: string,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return await this.employeesService.getEmployeesByOrganizationId(
      organization_id,
    );
  }

  @Get('/sales-group/:sales_group_id')
  async getEmployeeByGroupId(
    @Headers('organization_id') organization_id: string,
    @Param('sales_group_id') sales_group_id: string,
  ) {
    return await this.employeesService.getEmployeesBySalesGroupId(
      organization_id,
      sales_group_id,
    );
  }

  @Get('/view/:employee_id')
  async getEmployeeById(
    @Headers('organization_id') organization_id: string,
    @Param('employee_id') employee_id: string,
  ) {
    return await this.employeesService.viewEmployeeById(
      organization_id,
      employee_id,
    );
  }

  @Post()
  @UsePipes(new ZodSchemaValidationPipe(SchemaEmployee))
  async addEmployee(
    @Headers('organization_id') organization_id: string,
    @Body() employeeData: TEmployee,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    const { employee_username, employee_nic_number, employee_phone } =
      employeeData;

    return await this.employeesService.addEmployee({
      employee_id: uuid().toString(),
      employee_organization_id: organization_id,
      employee_sales_group_id: undefined,
      employee_username: employee_username,
      employee_phone: employee_phone,
      employee_registration_date: Date.now(),
      employee_nic_number: employee_nic_number,
    });
  }

  @Patch('/update/username/:employee_id')
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({ employee_username: z.string().nonempty().nonoptional() }),
    ),
  )
  async updateEmployeeUserName(
    @Headers('organization_id') organization_id: string,
    @Param('employee_id') employee_id: string,
    @Body() employeeData: Pick<TEmployee, 'employee_username'>,
  ) {
    return await this.employeesService.updateEmployeeUsernameById(
      organization_id,
      employee_id,
      employeeData.employee_username,
    );
  }

  @Patch('/update/nic/:employee_id')
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({ employee_nic_number: z.string().nonempty().nonoptional() }),
    ),
  )
  async updateEmployeeNic(
    @Headers('organization_id') organization_id: string,
    @Param('employee_id') employee_id: string,
    @Body() employeeData: Pick<TEmployee, 'employee_nic_number'>,
  ) {
    return await this.employeesService.updateEmployeeNICById(
      organization_id,
      employee_id,
      employeeData.employee_nic_number,
    );
  }

  @Patch('/update/phone/:employee_id')
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({ employee_phone: z.string().nonempty().nonoptional() }),
    ),
  )
  async updateEmployeePhone(
    @Headers('organization_id') organization_id: string,
    @Param('employee_id') employee_id: string,
    @Body() employeeData: Pick<TEmployee, 'employee_phone'>,
  ) {
    return await this.employeesService.updateEmployeePhoneById(
      organization_id,
      employee_id,
      employeeData.employee_phone,
    );
  }

  @Patch('/update/add-to-sales-group/')
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({
        employee_sales_group_id: z.string().nonempty().nonoptional(),
      }),
    ),
  )
  async addEmployeesToSalesGroup(
    @Headers('organization_id') organization_id: string,
    @Body('employees_ids') employees_ids: string[],
    @Body() employeeData: Pick<TEmployee, 'employee_sales_group_id'>,
  ) {
    return await this.employeesService.addEmployeesToSalesGroupByIds(
      organization_id,
      employees_ids,
      employeeData.employee_sales_group_id,
    );
  }

  @Patch('/update/remove-from-sales-group/')
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({ employees_ids: z.array(z.string()) }),
    ),
  )
  async removeEmployeesFromSalesGroup(
    @Headers('organization_id') organization_id: string,
    @Body() data: Record<'employees_ids', string[]>,
  ) {
    return await this.employeesService.removeEmployeesFromSalesGroup(
      organization_id,
      data.employees_ids,
    );
  }

  @Delete('/delete/:employee_id')
  async deleteEmployee(
    @Headers('organization_id') organization_id: string,
    @Param('employee_id') employee_id: string,
  ) {
    return await this.employeesService.deleteEmployeeById(
      organization_id,
      employee_id,
    );
  }

  @Delete('/delete')
  async deleteEmployees(
    @Headers('organization_id') organization_id: string,
    @Query('employees_ids') employees_ids: string[],
  ) {
    return await employees_ids.map((employee_id) => {
      return this.employeesService.deleteEmployeeById(
        organization_id,
        employee_id,
      );
    });
  }
}
