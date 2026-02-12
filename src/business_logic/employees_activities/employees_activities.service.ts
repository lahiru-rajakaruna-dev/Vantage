import {
    Inject,
    Injectable
}                                from '@nestjs/common';
import { v4 as uuid }            from 'uuid'
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import { TEmployeeActivityData } from '../../orm/drizzle/drizzle-postgres/schema';
import { TOKEN__ORM_FACTORY }    from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface        from '../../orm/orm.interface';



@Injectable()
export class EmployeesActivitiesService {
    private readonly orm: IOrmInterface;
    private readonly logger: ILoggerService
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
        orm: IOrmInterface,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService
    ) {
        this.orm    = orm;
        this.logger = logger
    }
    
    
    getEmployeeActivityProfile(
        organization_id: string,
        employee_id: string,
        start_date?: number,
        end_date?: number,
    ) {
        return this.orm.getEmployeeActivityProfile(
            organization_id,
            employee_id,
            start_date,
            end_date
        )
    }
    
    
    addEmployeeActivity(
        organization_id: string,
        employee_id: string,
        activity_data: TEmployeeActivityData
    ) {
        const activity_id = uuid()
        
        return this.orm.addEmployeeActivity(
            organization_id,
            employee_id,
            activity_id,
            activity_data
        )
    }
}
