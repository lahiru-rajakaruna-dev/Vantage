import {
    Test,
    TestingModule
}                                    from '@nestjs/testing';
import { EmployeeAttendanceService } from './employee_attendance.service';



describe('EmployeeAttendanceService', () => {
    let service: EmployeeAttendanceService;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
                                                                         providers: [ EmployeeAttendanceService ],
                                                                     })
                                                .compile();
        
        service = module.get<EmployeeAttendanceService>(
            EmployeeAttendanceService);
    });
    
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
