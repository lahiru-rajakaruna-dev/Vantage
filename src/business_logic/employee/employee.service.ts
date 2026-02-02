import { Inject, Injectable } from '@nestjs/common';
import { TOKEN__ORM_FACTORY } from 'src/orm/orm-factory/orm-factory.service';
import type IOrmInterface     from '../../orm/orm.interface';
import { type TEmployee }     from '../../orm/orm.interface';



@Injectable()
export class EmployeeService {
    private readonly orm: IOrmInterface;
    
    
    constructor(@Inject(TOKEN__ORM_FACTORY) orm: IOrmInterface) {
        this.orm = orm;
    }
    
    
    async addEmployee(
        organization_id: string,
        employeeData: {
            employees_credentials_username: string,
            employees_credentials_password: string
        }
    ): Promise<TEmployee[]> {
        return await this.orm.addEmployee(organization_id, employeeData);
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
    
    
    async getEmployeesByOrganizationId(organization_id: string,): Promise<TEmployee[]> {
        return await this.orm.getEmployeesByOrganizationId(organization_id);
    }
    
    
    async addEmployeesToSalesGroupByIds(
        organization_id: string,
        employees_ids: string[],
        sales_group_id: string,
    ): Promise<TEmployee[]> {
        return await this.orm.updateEmployeesByIds(
            organization_id,
            employees_ids,
            {
                employee_sales_group_id: sales_group_id,
            }
        );
    }
    
    
    async removeEmployeesFromSalesGroup(
        organization_id: string,
        employees_ids: string[],
    ): Promise<TEmployee[]> {
        return await this.orm.updateEmployeesByIds(
            organization_id,
            employees_ids,
            {
                employee_sales_group_id: null,
            }
        );
    }
    
    
    async updateEmployeeUsernameById(
        organization_id: string,
        employee_id: string,
        employee_first_name: string,
        employee_last_name: string
    ): Promise<TEmployee[]> {
        return await this.orm.updateEmployeeById(organization_id, employee_id, {
            employee_first_name: employee_first_name,
            employee_last_name : employee_last_name,
        });
    }
    
    
    async updateEmployeeNICById(
        organization_id: string,
        employee_id: string,
        employee_nic_number: string,
    ): Promise<TEmployee[]> {
        return await this.orm.updateEmployeeById(organization_id, employee_id, {
            employee_nic_number: employee_nic_number,
        });
    }
    
    
    async updateEmployeePhoneById(
        organization_id: string,
        employee_id: string,
        employee_phone: string,
    ): Promise<TEmployee[]> {
        return await this.orm.updateEmployeeById(organization_id, employee_id, {
            employee_phone: employee_phone,
        });
    }
    
    
    async deleteEmployeeById(
        organization_id: string,
        employee_id: string,
    ): Promise<TEmployee[]> {
        return await this.orm.deleteEmployeeById(organization_id, employee_id);
    }
}
