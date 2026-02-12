import {
    Test,
    TestingModule
}                                   from '@nestjs/testing';
import { EmployeesSyncsController } from './employees_syncs.controller';



describe(
    'EmployeesSyncsController',
    () => {
        let controller: EmployeesSyncsController;
        
        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                                                                             controllers: [ EmployeesSyncsController ],
                                                                         })
                                                    .compile();
            
            controller = module.get<EmployeesSyncsController>(EmployeesSyncsController);
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
