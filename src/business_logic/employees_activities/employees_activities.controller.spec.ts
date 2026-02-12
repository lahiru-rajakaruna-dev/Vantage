import {
    Test,
    TestingModule
}                                        from '@nestjs/testing';
import { EmployeesActivitiesController } from './employees_activities.controller';



describe(
    'EmployeesActivitiesController',
    () => {
        let controller: EmployeesActivitiesController;
        
        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                                                                             controllers: [ EmployeesActivitiesController ],
                                                                         })
                                                    .compile();
            
            controller = module.get<EmployeesActivitiesController>(EmployeesActivitiesController);
        });
        
        it(
            'should be defined',
            () => {
                expect(controller)
                    .toBeDefined();
            }
        );
    }
);
