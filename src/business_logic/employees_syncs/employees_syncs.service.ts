import {
    Inject,
    Injectable
}                                from '@nestjs/common';
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import {
    TEmployeeSyncSelect,
    TEmployeeSyncUpdate
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import { TOKEN__ORM_FACTORY }    from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface        from '../../orm/orm.interface';



@Injectable()
export class EmployeesSyncsService {
    private readonly orm: IOrmInterface
    private readonly logger: ILoggerService;
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
        orm: IOrmInterface,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService
    ) {
        this.logger = logger;
        this.orm    = orm
    }
    
    
    getEmployeeSyncProfile(
        organization_id: string,
        employee_id: string
    ): Promise<TEmployeeSyncSelect> {
        return this.orm.getEmployeeSyncProfileById(
            organization_id,
            employee_id
        )
    }
    
    
    updateEmployeeSyncProfile(
        organization_id: string,
        employee_id: string,
        employeeSyncUpdates: TEmployeeSyncUpdate,
    ): Promise<TEmployeeSyncSelect> {
        return this.orm.updateEmployeeSyncProfileById(
            organization_id,
            employee_id,
            employeeSyncUpdates
        )
    }
}
