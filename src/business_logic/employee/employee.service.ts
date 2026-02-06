import {
    Inject,
    Injectable
} from '@nestjs/common';
import { TOKEN__ORM_FACTORY } from 'src/orm/orm-factory/orm-factory.service';
import { v4 as uuid } from 'uuid'
import {
    TEmployeeCredentialsData,
    TEmployeeSelect,
} from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import type IOrmInterface from '../../orm/orm.interface';



@Injectable()
export class EmployeeService {
    private readonly orm: IOrmInterface
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
        orm: IOrmInterface) {
        this.orm = orm;
    }
    
    
    async addEmployee(
        organization_id: string,
        employeeData: TEmployeeCredentialsData
    ): Promise<TEmployeeSelect[]> {
        const employee_id = uuid().toString()
        
        const today = new Date(Date.now())
        
        return await this.orm.addEmployee(
            organization_id,
            employee_id,
            today.getMonth(),
            today.getFullYear(),
            employeeData
        );
    }
    
    
    async getEmployeeProfile(
        organization_id: string,
        employee_id: string,
    ): Promise<TEmployeeSelect> {
        return await this.orm.getEmployeeProfileById(
            organization_id,
            employee_id
        );
    }
    
    
    async getEmployeesBySalesGroupId(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TEmployeeSelect[]> {
        return await this.orm.getEmployeesBySalesGroupId(
            organization_id,
            sales_group_id,
        );
    }
    
    
    async getEmployeesByOrganizationId(organization_id: string,): Promise<TEmployeeSelect[]> {
        return await this.orm.getEmployeesByOrganizationId(organization_id);
    }
    
    
    async addEmployeesToSalesGroupByIds(
        organization_id: string,
        employees_ids: string[],
        sales_group_id: string,
    ): Promise<TEmployeeSelect[]> {
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
    ): Promise<TEmployeeSelect[]> {
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
    ): Promise<TEmployeeSelect[]> {
        return await this.orm.updateEmployeeById(organization_id, employee_id, {
            employee_first_name: employee_first_name,
            employee_last_name : employee_last_name,
        });
    }
    
    
    async updateEmployeeNICById(
        organization_id: string,
        employee_id: string,
        employee_nic_number: string,
    ): Promise<TEmployeeSelect[]> {
        return await this.orm.updateEmployeeById(organization_id, employee_id, {
            employee_nic_number: employee_nic_number,
        });
    }
    
    
    async updateEmployeePhoneById(
        organization_id: string,
        employee_id: string,
        employee_phone: string,
    ): Promise<TEmployeeSelect[]> {
        return await this.orm.updateEmployeeById(organization_id, employee_id, {
            employee_phone: employee_phone,
        });
    }
    
    
    async suspendEmployee(
        organization_id: string,
        employee_id: string,
    ): Promise<TEmployeeSelect[]> {
        return await this.orm.updateEmployeeById(organization_id, employee_id, {
            employee_status: 'SUSPENDED'
        });
    }
    
    
    async fireEmployee(
        organization_id: string,
        employee_id: string,
    ): Promise<TEmployeeSelect[]> {
        return await this.orm.updateEmployeeById(organization_id, employee_id, {
            employee_status: 'FIRED'
        });
    }
}
