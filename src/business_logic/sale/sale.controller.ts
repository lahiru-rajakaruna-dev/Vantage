import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UnauthorizedException,
    UsePipes,
}                              from '@nestjs/common';
import {
    SchemaInsertSale,
    TOrganizationSelect,
    TSaleInsert,
    TSaleSelect
}                              from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import { SaleService }         from './sale.service';



@Controller('sale')
export class SaleController {
    private readonly saleService: SaleService;
    
    
    constructor(saleService: SaleService) {
        this.saleService = saleService;
    }
    
    
    @Post()
    @UsePipes(
        new ZodSchemaValidationPipe(
            SchemaInsertSale.pick({
                                      sale_client_id        : true,
                                      sale_client_payment_id: true,
                                      sale_item_id          : true,
                                      sale_item_unit_count  : true,
                                      sale_value            : true
                                  })
                            .nonoptional()
        ),
    )
    async addSale(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Body() saleData: Omit<TSaleInsert, 'sale_organization_id' | 'sale_employee_id' | 'sale_date' | 'sale_id'>,
    ): Promise<TSaleSelect[]> {
        
        if (!request.organization) {
            throw new UnauthorizedException('[-] Invalid request...');
        }
        
        const user_id = request['cookies']['user_id'];
        
        if (!user_id) {
            throw new BadRequestException('User not found...')
        }
        
        return await this.saleService.addSale(
            request.organization.organization_id,
            user_id, // employee_id comes from cookies
            {
                sale_client_id        : saleData.sale_client_id,
                sale_item_id          : saleData.sale_item_id,
                sale_client_payment_id: saleData.sale_client_payment_id,
                sale_item_unit_count  : saleData.sale_item_unit_count,
                sale_value            : saleData.sale_value,
                sale_date             : Date.now(),
            }
        );
    }
    
    
    @Get('/profile/:sale_id')
    async getSaleProfile(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('sale_id') sale_id: string,
    ): Promise<TSaleSelect> {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.saleService.viewSaleById(
            request.organization.organization_id,
            sale_id,
        );
    }
    
    
    @Get('/view/organization')
    async getSalesByOrganizationId(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
    ): Promise<TSaleSelect[]> {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.saleService.getSalesByOrganizationId(
            request.organization.organization_id,
        );
    }
    
    
    @Get('/view/employee/:employee_id')
    async getSalesByEmployeeId(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('employee_id') employee_id: string,
    ): Promise<TSaleSelect[]> {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.saleService.getSalesByEmployeeId(
            request.organization.organization_id,
            employee_id,
        );
    }
    
    
    @Get('/view/item/:item_id')
    async getSalesByItemId(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('item_id') item_id: string,
    ): Promise<TSaleSelect[]> {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.saleService.getSalesByItemId(
            request.organization.organization_id,
            item_id,
        );
    }
    
    
    @Get('/view/client/:client_id')
    async getSalesByClientId(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id') client_id: string,
    ): Promise<TSaleSelect[]> {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.saleService.getSalesByClientId(
            request.organization.organization_id,
            client_id,
        );
    }
    
    
    @Get('/view/date/:date')
    async getSalesByDate(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('date') date: number,
    ): Promise<TSaleSelect[]> {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.saleService.getSalesByDate(
            request.organization.organization_id,
            date,
        );
    }
    
    
    @Get('/view/date-range/:date_start/:date_end')
    async getSalesByDateRange(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('date_start') date_start: number,
        @Param('date_end') date_end: number,
    ): Promise<TSaleSelect[]> {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.saleService.getSalesWithinDates(
            request.organization.organization_id,
            date_start,
            date_end,
        );
    }
}
