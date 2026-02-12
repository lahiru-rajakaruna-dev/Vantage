import { Module }                        from '@nestjs/common';
import { LoggerModule }                  from '../../logger/logger.module';
import { OrmModule }                     from '../../orm/orm.module';
import { EmployeesActivitiesController } from './employees_activities.controller';
import { EmployeesActivitiesService }    from './employees_activities.service';



@Module({
            imports    : [
                LoggerModule,
                OrmModule
            ],
            providers  : [ EmployeesActivitiesService ],
            controllers: [ EmployeesActivitiesController ],
            exports    : [ EmployeesActivitiesService ]
        })
export class EmployeesActivitiesModule {
}
