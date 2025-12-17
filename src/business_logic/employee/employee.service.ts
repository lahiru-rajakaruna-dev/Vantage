import { Inject, Injectable } from '@nestjs/common';
import { TOKEN__ORM_FACTORY } from 'src/orm/orm-factory/orm-factory.service';
import { TEmployee } from 'src/orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import type IOrmInterface from '../../orm/orm.interface';

@Injectable()
export class EmployeeService {
  private readonly orm: IOrmInterface;

  constructor(@Inject(TOKEN__ORM_FACTORY) orm: IOrmInterface) {
    this.orm = orm;
  }

  async addEmployee(employeeData: TEmployee): Promise<TEmployee> {
    return await this.orm.addEmployee(employeeData);
  }

  async viewEmployeeById(employee_id: string): Promise<TEmployee | undefined> {
    return await this.orm.viewEmployeeById(employee_id);
  }

  async getEmployeesBySalesGroupId(
    sales_group_id: string,
  ): Promise<TEmployee[]> {
    return await this.orm.getEmployeesBySalesGroupId(sales_group_id);
  }

  async getEmployeesByOrganizationId(
    organization_id: string,
  ): Promise<TEmployee[]> {
    return await this.orm.getEmployeesByOrganizationId(organization_id);
  }

  async addEmployeesToSalesGroupByIds(
    employee_ids: string[],
    sales_group_id: string,
  ): Promise<TEmployee[]> {
    const promises = employee_ids.map((employee_id) => {
      return this.orm.updateEmployeeById(employee_id, {
        employee_sales_group_id: sales_group_id,
      });
    });
    return Promise.all(promises);
  }

  async removeEmployeesFromSalesGroup(
    employee_ids: string[],
  ): Promise<TEmployee[]> {
    const promises = employee_ids.map((employee_id) => {
      return this.orm.updateEmployeeById(employee_id, {
        employee_sales_group_id: null,
      });
    });
    return Promise.all(promises);
  }

  async updateEmployeeUsernameById(
    employee_id: string,
    employee_username: string,
  ): Promise<TEmployee> {
    return await this.orm.updateEmployeeById(employee_id, {
      employee_username: employee_username,
    });
  }

  async updateEmployeeNICById(
    employee_id: string,
    employee_nic_number: string,
  ): Promise<TEmployee> {
    return await this.orm.updateEmployeeById(employee_id, {
      employee_nic_number: employee_nic_number,
    });
  }

  async updateEmployeePhoneById(
    employee_id: string,
    employee_phone: string,
  ): Promise<TEmployee> {
    return await this.orm.updateEmployeeById(employee_id, {
      employee_phone: employee_phone,
    });
  }

  async deleteEmployeeById(employee_id: string): Promise<TEmployee> {
    return await this.orm.deleteEmployeeById(employee_id);
  }
}
