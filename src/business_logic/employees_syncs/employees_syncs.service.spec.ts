import {
    Test,
    TestingModule
}                                from '@nestjs/testing';
import { EmployeesSyncsService } from './employees_syncs.service';



describe(
    'EmployeesSyncsService',
    () => {
        let service: EmployeesSyncsService;
        
        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                                                                             providers: [ EmployeesSyncsService ],
                                                                         })
                                                    .compile();
            
            service = module.get<EmployeesSyncsService>(EmployeesSyncsService);
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
