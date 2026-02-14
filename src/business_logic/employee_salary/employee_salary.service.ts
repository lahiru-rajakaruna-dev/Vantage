import {
    Inject,
    Injectable
} from '@nestjs/common';

import { v4 as uuid }            from 'uuid'
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import {
    TEmployeeSalaryProfileUpdate,
    TEmployeeSalaryRecordData
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import { TOKEN__ORM_FACTORY }    from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface        from '../../orm/orm.interface';



@Injectable()
export class EmployeeSalaryService {
    private readonly orm: IOrmInterface;
    private readonly logger: ILoggerService
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
        orm: IOrmInterface,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService
    ) {
        this.logger = logger;
        this.orm    = orm
    }
    
    
    getEmployeeSalaryProfile(
        organization_id: string,
        employee_id: string
    ) {
        return this.orm.getEmployeeSalaryProfileById(
            organization_id,
            employee_id
        )
    }
    
    
    getEmployeeSalaryRecords(
        organization_id: string,
        employee_id: string,
        date?: {
            year: number,
            month: number
        }
    ) {
        
        let sentDate: Date | undefined;
        let sentDateMonthEnd: Date | undefined;
        
        if (date) {
            sentDate         = new Date(
                date.year,
                date.month,
                1
            )
            sentDateMonthEnd = new Date(
                date.year,
                date.month + 1,
                0
            )
        }
        
        return this.orm.getEmployeeSalaryRecords(
            organization_id,
            employee_id,
            sentDate?.getTime(),
            sentDateMonthEnd?.getTime()
        )
    }
    
    
    addEmployeeSalaryRecord(
        organization_id: string,
        employee_id: string,
        employeeSalaryRecordData: TEmployeeSalaryRecordData
    ) {
        const salary_record_id = uuid()
        
        return this.orm.addEmployeeSalaryRecord(
            organization_id,
            employee_id,
            salary_record_id,
            employeeSalaryRecordData
        )
    }
    
    
    updateEmployeeSalaryProfile(
        organization_id: string,
        employee_id: string,
        employeeSalaryProfileUpdates: TEmployeeSalaryProfileUpdate
    ) {
        return this.orm.updateEmployeeSalaryProfile(
            organization_id,
            employee_id,
            employeeSalaryProfileUpdates
        )
    }
}
