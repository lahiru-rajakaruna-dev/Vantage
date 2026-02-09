import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Req,
    UsePipes,
}                                from '@nestjs/common';
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import {
    SchemaSaleData,
    type TOrganizationSelect,
    type TSaleData,
    type TSaleSelect
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import ZodSchemaValidationPipe   from '../../pipes/schema_validation.pipe';
import { BaseController }        from '../abstract.base.controller';
import { SaleService }           from './sale.service';



@Controller('sale')
export class SaleController extends BaseController {
    private readonly saleService: SaleService;
    
    
    constructor(
        saleService: SaleService,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService
    ) {
        super(logger)
        this.saleService = saleService;
    }
    
    
    @Post()
    @UsePipes(new ZodSchemaValidationPipe(SchemaSaleData))
    async addSale(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Body()
        saleData: TSaleData
    ): Promise<TSaleSelect[]> {
        
        const req_organization_id = this.validateOrganization(req)
        const user_id             = req['cookies']['user_id'];
        
        if (!user_id) {
            throw new BadRequestException('User not found...')
        }
        
        return await this.saleService.addSale(
            req_organization_id,
            user_id,
            saleData,
        );
    }
    
    
    @Get('/:sale_id')
    async getSaleProfile(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('sale_id')
        sale_id: string,
    ): Promise<TSaleSelect> {
        const req_organization_id = this.validateOrganization(req)
        
        if (!sale_id) {
            throw new BadRequestException('Missing sale_id')
        }
        
        return await this.saleService.viewSaleById(
            req_organization_id,
            sale_id,
        );
    }
    
    
    @Get('/organization')
    async getSalesByOrganizationId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },): Promise<TSaleSelect[]> {
        const req_organization_id = this.validateOrganization(req)
        return await this.saleService.getSalesByOrganizationId(req_organization_id,);
    }
    
    
    @Get('/employee/:employee_id')
    async getSalesByEmployeeId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id')
        employee_id: string,
    ): Promise<TSaleSelect[]> {
        const req_organization_id = this.validateOrganization(req)
        return await this.saleService.getSalesByEmployeeId(
            req_organization_id,
            employee_id,
        );
    }
    
    
    @Get('/item/:item_id')
    async getSalesByItemId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('item_id')
        item_id: string,
    ): Promise<TSaleSelect[]> {
        const req_organization_id = this.validateOrganization(req)
        return await this.saleService.getSalesByItemId(
            req_organization_id,
            item_id,
        );
    }
    
    
    @Get('/client/:client_id')
    async getSalesByClientId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
    ): Promise<TSaleSelect[]> {
        const req_organization_id = this.validateOrganization(req)
        return await this.saleService.getSalesByClientId(
            req_organization_id,
            client_id,
        );
    }
    
    
    @Get('/date/:date')
    async getSalesByDate(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('date')
        date: number,
    ): Promise<TSaleSelect[]> {
        const req_organization_id = this.validateOrganization(req)
        return await this.saleService.getSalesByDate(
            req_organization_id,
            date,
        );
    }
    
    
    @Get('/date-range/:date_start/:date_end')
    async getSalesByDateRange(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('date_start')
        date_start: number,
        @Param('date_end')
        date_end: number,
    ): Promise<TSaleSelect[]> {
        
        const req_organization_id = this.validateOrganization(req)
        
        return await this.saleService.getSalesWithinDates(
            req_organization_id,
            date_start,
            date_end,
        );
    }
}
