import {
    Inject,
    Injectable
} from '@nestjs/common';
import { TOKEN__DRIZZLE_FACTORY } from '../../orm/drizzle/drizzle-factory/drizzle-factory.service';
import type IOrmInterface from '../../orm/orm.interface';



@Injectable()
export class EmployeeAttendanceService {
    private readonly orm: IOrmInterface
    
    
    constructor(
        @Inject(TOKEN__DRIZZLE_FACTORY)
        orm: IOrmInterface) {
        this.orm = orm
    }
    
    
    async getEmployeeAttendanceById(
        organization_id: string,
        employee_id: string
    ) {
        return this.orm.getEmployeeAttendance(organization_id, employee_id)
    }
}
