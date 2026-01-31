import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Req,
    UnauthorizedException,
    UsePipes,
}                                    from '@nestjs/common';
import { v4 as uuid }                from 'uuid';
import { type TSale }                from '../../orm/orm.interface';
import ZodSchemaValidationPipe       from '../../pipes/schema_validation.pipe';
import { SaleSchema, TOrganization } from '../../schemas';
import { SaleService }               from './sale.service';



@Controller('sale')
export class SaleController {
    private readonly saleService: SaleService;
    
    
    constructor(@Inject() saleService: SaleService) {
        this.saleService = saleService;
    }
    
    
    @Post()
    @UsePipes(
        new ZodSchemaValidationPipe(
            SaleSchema.pick({
                                sale_employee_id      : true,
                                sale_client_id        : true,
                                sale_client_payment_id: true,
                                sale_item_id          : true,
                                sale_item_unit_count  : true,
                            })
        ),
    )
    async addSale(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Body() saleData: TSale,
    ): Promise<TSale[]> {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.saleService.addSale({
                                                  sale_id               : uuid()
                                                      .toString(),
                                                  sale_organization_id  : request.organization.organization_id,
                                                  sale_employee_id      : saleData.sale_employee_id,
                                                  sale_client_id        : saleData.sale_client_id,
                                                  sale_client_payment_id: saleData.sale_client_payment_id,
                                                  sale_item_id          : saleData.sale_item_id,
                                                  sale_item_unit_count  : saleData.sale_item_unit_count,
                                                  sale_date             : Date.now(),
                                              });
    }
    
    
    @Get('/profile/:sale_id')
    async getSaleProfile(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('sale_id') sale_id: string,
    ): Promise<TSale> {
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
            organization: TOrganization
        },
    ): Promise<TSale[]> {
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
            organization: TOrganization
        },
        @Param('employee_id') employee_id: string,
    ): Promise<TSale[]> {
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
            organization: TOrganization
        },
        @Param('item_id') item_id: string,
    ): Promise<TSale[]> {
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
            organization: TOrganization
        },
        @Param('client_id') client_id: string,
    ): Promise<TSale[]> {
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
            organization: TOrganization
        },
        @Param('date') date: number,
    ): Promise<TSale[]> {
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
            organization: TOrganization
        },
        @Param('date_start') date_start: number,
        @Param('date_end') date_end: number,
    ): Promise<TSale[]> {
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