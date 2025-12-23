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

  async viewEmployeeById(
    organization_id: string,
    employee_id: string,
  ): Promise<TEmployee | undefined> {
    return await this.orm.viewEmployeeById(organization_id, employee_id);
  }

  async getEmployeesBySalesGroupId(
    organization_id: string,
    sales_group_id: string,
  ): Promise<TEmployee[]> {
    return await this.orm.getEmployeesBySalesGroupId(
      organization_id,
      sales_group_id,
    );
  }

  async getEmployeesByOrganizationId(
    organization_id: string,
  ): Promise<TEmployee[]> {
    return await this.orm.getEmployeesByOrganizationId(organization_id);
  }

  async addEmployeesToSalesGroupByIds(
    organization_id: string,
    employee_ids: string[],
    sales_group_id: string,
  ): Promise<TEmployee[]> {
    const promises = employee_ids.map((employee_id) => {
      return this.orm.updateEmployeeById(organization_id, employee_id, {
        employee_sales_group_id: sales_group_id,
      });
    });
    return Promise.all(promises);
  }

  async removeEmployeesFromSalesGroup(
    organization_id: string,
    employee_ids: string[],
  ): Promise<TEmployee[]> {
    const promises = employee_ids.map((employee_id) => {
      return this.orm.updateEmployeeById(organization_id, employee_id, {
        employee_sales_group_id: null,
      });
    });
    return Promise.all(promises);
  }

  async updateEmployeeUsernameById(
    organization_id: string,
    employee_id: string,
    employee_username: string,
  ): Promise<TEmployee> {
    return await this.orm.updateEmployeeById(organization_id, employee_id, {
      employee_username: employee_username,
    });
  }

  async updateEmployeeNICById(
    organization_id: string,
    employee_id: string,
    employee_nic_number: string,
  ): Promise<TEmployee> {
    return await this.orm.updateEmployeeById(organization_id, employee_id, {
      employee_nic_number: employee_nic_number,
    });
  }

  async updateEmployeePhoneById(
    organization_id: string,
    employee_id: string,
    employee_phone: string,
  ): Promise<TEmployee> {
    return await this.orm.updateEmployeeById(organization_id, employee_id, {
      employee_phone: employee_phone,
    });
  }

  async deleteEmployeeById(
    organization_id: string,
    employee_id: string,
  ): Promise<TEmployee> {
    return await this.orm.deleteEmployeeById(organization_id, employee_id);
  }
}
