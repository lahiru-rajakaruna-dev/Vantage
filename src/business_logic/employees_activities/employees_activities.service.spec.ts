import {
    Test,
    TestingModule
}                                     from '@nestjs/testing';
import { EmployeesActivitiesService } from './employees_activities.service';



describe(
    'EmployeesActivitiesService',
    () => {
        let service: EmployeesActivitiesService;
        
        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                                                                             providers: [ EmployeesActivitiesService ],
                                                                         })
                                                    .compile();
            
            service = module.get<EmployeesActivitiesService>(EmployeesActivitiesService);
        });
        
        it(
            'should be defined',
            () => {
                expect(service)
                    .toBeDefined();
            }
        );
    }
);
