import {
    Inject,
    Injectable
} from '@nestjs/common';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface from '../../orm/orm.interface';



@Injectable()
export class EmployeeAttendanceService {
    private readonly orm: IOrmInterface
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
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
