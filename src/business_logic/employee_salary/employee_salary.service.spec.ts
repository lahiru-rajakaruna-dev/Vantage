import {
    Test,
    TestingModule
}                                from '@nestjs/testing';
import { EmployeeSalaryService } from './employee_salary.service';



describe(
    'EmployeeSalaryService',
    () => {
        let service: EmployeeSalaryService;
        
        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                                                                             providers: [ EmployeeSalaryService ],
                                                                         })
                                                    .compile();
            
            service = module.get<EmployeeSalaryService>(EmployeeSalaryService);
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
