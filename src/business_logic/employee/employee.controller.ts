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
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { v4 as uuid } from 'uuid';

@Controller('employee')
export class EmployeeController {
  private employeesService: EmployeeService;
  constructor(employeesService: EmployeeService) {
    this.employeesService = employeesService;
  }

  @Get('/view')
  getAllEmployeesByOrganizationId(
    @Headers('organization_id') organization_id: string,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.employeesService.getEmployeesByOrganizationId(organization_id);
  }

  @Get('/sales-group/:sales_group_id')
  getEmployeeByGroupId(
    @Headers('organization_id') organization_id: string,
    @Param('sales_group_id') sales_group_id: string,
  ) {
    return this.employeesService.getEmployeesBySalesGroupId(
      organization_id,
      sales_group_id,
    );
  }

  @Get('/view/:employee_id')
  getEmployeeById(
    @Headers('organization_id') organization_id: string,
    @Param('employee_id') employee_id: string,
  ) {
    return this.employeesService.viewEmployeeById(organization_id, employee_id);
  }

  @Post()
  addEmployee(
    @Headers('organization_id') organization_id: string,
    @Body('employee_username') employee_username: string,
    @Body('employee_phone') employee_phone: string,
    @Body('employee_nic_number') employee_nic_number: string,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.employeesService.addEmployee({
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
  updateEmployeeUserName(
    @Headers('organization_id') organization_id: string,
    @Param('employee_id') employee_id: string,
    @Body('employee_username') employee_username: string,
  ) {
    return this.employeesService.updateEmployeeUsernameById(
      organization_id,
      employee_id,
      employee_username,
    );
  }

  @Patch('/update/nic/:employee_id')
  updateEmployeeNic(
    @Headers('organization_id') organization_id: string,
    @Param('employee_id') employee_id: string,
    @Body('employee_nic_number') employee_nic_number: string,
  ) {
    return this.employeesService.updateEmployeeNICById(
      organization_id,
      employee_id,
      employee_nic_number,
    );
  }

  @Patch('/update/phone/:employee_id')
  updateEmployeePhone(
    @Headers('organization_id') organization_id: string,
    @Param('employee_id') employee_id: string,
    @Body('employee_phone') employee_phone: string,
  ) {
    return this.employeesService.updateEmployeePhoneById(
      organization_id,
      employee_id,
      employee_phone,
    );
  }

  @Patch('/update/add-to-sales-group/')
  addEmployeesToSalesGroup(
    @Headers('organization_id') organization_id: string,
    @Body('employees_ids') employees_ids: string[],
    @Body('employee_sales_group_id') employee_sales_group_id: string,
  ) {
    return this.employeesService.addEmployeesToSalesGroupByIds(
      organization_id,
      employees_ids,
      employee_sales_group_id,
    );
  }

  @Patch('/update/remove-from-sales-group/')
  removeEmployeesFromSalesGroup(
    @Headers('organization_id') organization_id: string,
    @Body('employees_ids') employees_ids: string[],
  ) {
    return this.employeesService.removeEmployeesFromSalesGroup(
      organization_id,
      employees_ids,
    );
  }

  @Delete('/delete/:employee_id')
  deleteEmployee(
    @Headers('organization_id') organization_id: string,
    @Param('employee_id') employee_id: string,
  ) {
    return this.employeesService.deleteEmployeeById(
      organization_id,
      employee_id,
    );
  }

  @Delete('/delete')
  deleteEmployees(
    @Headers('organization_id') organization_id: string,
    @Query('employees_ids') employees_ids: string[],
  ) {
    return employees_ids.map((employee_id) => {
      return this.employeesService.deleteEmployeeById(
        organization_id,
        employee_id,
      );
    });
  }
}
