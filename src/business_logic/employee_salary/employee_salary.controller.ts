import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UsePipes
}                                from '@nestjs/common';
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import {
    SchemaEmployeeSalaryProfileUpdate,
    SchemaEmployeeSalaryRecordData,
    type TEmployeeSalaryProfileUpdate,
    type   TEmployeeSalaryRecordData,
    type TOrganizationSelect
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import ZodSchemaValidationPipe   from '../../pipes/schema_validation.pipe';
import { BaseController }        from '../abstract.base.controller';
import { EmployeeSalaryService } from './employee_salary.service';



@Controller('employees-salaries')
export class EmployeeSalaryController extends BaseController {
    private readonly employeeSalaryService: EmployeeSalaryService;
    
    
    constructor(
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService,
        employeeSalaryService: EmployeeSalaryService
    ) {
        super(logger);
        this.employeeSalaryService = employeeSalaryService
        
    }
    
    
    @Get('/:employee_id')
    async getEmployeeSalaryProfile(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Param('employee_id')
        employee_id: string
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!employee_id) {
            throw new BadRequestException('Employee id not found')
        }
        
        return this.employeeSalaryService.getEmployeeSalaryProfile(
            req_organization_id,
            employee_id
        )
    }
    
    
    @Patch('/:employee_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaEmployeeSalaryProfileUpdate))
    async updateEmployeeSalaryProfile(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Param('employee_id')
        employee_id: string,
        @Body()
        salaryProfileUpdates: TEmployeeSalaryProfileUpdate
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!employee_id) {
            throw new BadRequestException('Employee id not found')
        }
        
        return this.employeeSalaryService.updateEmployeeSalaryProfile(
            req_organization_id,
            employee_id,
            salaryProfileUpdates
        )
    }
    
    
    @Get('/records/:employee_id')
    async getEmployeeSalaryRecords(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Param('employee_id')
        employee_id: string,
        @Query(
            'year',
            ParseIntPipe
        )
        year: number,
        @Query(
            'month',
            ParseIntPipe
        )
        month: number
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!employee_id) {
            throw new BadRequestException('Employee id not found')
        }
        
        return this.employeeSalaryService.getEmployeeSalaryRecords(
            req_organization_id,
            employee_id,
            year && month
            ? {
                    year,
                    month,
                }
            : undefined
        )
    }
    
    
    @Post('/records/:employee_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaEmployeeSalaryRecordData))
    async addEmployeeSalaryRecord(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Param('employee_id')
        employee_id: string,
        @Body()
        salaryRecordData: TEmployeeSalaryRecordData
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!employee_id) {
            throw new BadRequestException('Employee id not found')
        }
        
        return this.employeeSalaryService.addEmployeeSalaryRecord(
            req_organization_id,
            employee_id,
            salaryRecordData
        )
    }
    
}
