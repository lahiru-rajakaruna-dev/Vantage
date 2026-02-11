import {
    Inject,
    Injectable
}                                from '@nestjs/common';
import { TOKEN__ORM_FACTORY }    from 'src/orm/orm-factory/orm-factory.service';
import { v4 as uuid }            from 'uuid'
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import {
    TEmployeeCredentialsData,
    TEmployeeSelect,
    TEmployeeUpdate,
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import type IOrmInterface        from '../../orm/orm.interface';



@Injectable()
export class EmployeeService {
    private readonly orm: IOrmInterface
    private readonly logger: ILoggerService;
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
        orm: IOrmInterface,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService
    ) {
        this.orm    = orm;
        this.logger = logger
    }
    
    
    async addEmployee(
        organization_id: string,
        employeeData: TEmployeeCredentialsData
    ): Promise<TEmployeeSelect[]> {
        const employee_id = uuid()
            .toString()
        
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
    
    
    async getEmployeesBySalesGroup(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TEmployeeSelect[]> {
        return await this.orm.getEmployeesBySalesGroupId(
            organization_id,
            sales_group_id,
        );
    }
    
    
    async getEmployeesByOrganization(organization_id: string,): Promise<TEmployeeSelect[]> {
        return await this.orm.getEmployeesByOrganizationId(organization_id);
    }
    
    
    async updateEmployees(
        organization_id: string,
        employees_ids: string[],
        employeeUpdates: TEmployeeUpdate,
    ): Promise<TEmployeeSelect[]> {
        return await this.orm.updateEmployeesByIds(
            organization_id,
            employees_ids,
            employeeUpdates
        );
    }
    
    
    async updateEmployee(
        organization_id: string,
        employee_id: string,
        employeeUpdates: TEmployeeUpdate
    ): Promise<TEmployeeSelect[]> {
        return await this.orm.updateEmployeeById(
            organization_id,
            employee_id,
            employeeUpdates
        );
    }
    
}
