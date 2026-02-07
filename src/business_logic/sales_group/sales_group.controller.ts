import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Req,
    UsePipes,
}                                from '@nestjs/common';
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import {
    SchemaSalesGroupData,
    TOrganizationSelect,
    TSalesGroupInsert,
    TSalesGroupUpdate
}                                from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import ZodSchemaValidationPipe   from '../../pipes/schema_validation.pipe';
import { BaseController }        from '../abstract.base.controller';
import { SalesGroupService }     from './sales_group.service';



@Controller('sales-group')
export class SalesGroupController extends BaseController {
    private readonly salesGroupService: SalesGroupService;
    
    
    constructor(
        salesGroupService: SalesGroupService,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService
    ) {
        super(logger)
        this.salesGroupService = salesGroupService
    }
    
    
    @Post()
    @UsePipes(new ZodSchemaValidationPipe(SchemaSalesGroupData))
    async addSalesGroup(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Body()
        salesGroupData: Pick<TSalesGroupInsert, 'sales_group_name' | 'sales_group_territory'>,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        const {
                  sales_group_name,
                  sales_group_territory
              } = salesGroupData
        
        if (!sales_group_name || !sales_group_territory) {
            throw new BadRequestException('Missing required data...')
        }
        
        return await this.salesGroupService.addSalesGroup(
            req_organization_id,
            {
                sales_group_name     : salesGroupData.sales_group_name,
                sales_group_territory: salesGroupData.sales_group_territory,
            }
        );
    }
    
    
    @Patch('/name/:sales_group_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaSalesGroupData))
    async updateSalesGroupName(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('sales_group_id')
        sales_group_id: string,
        @Body()
        salesGroupData: Pick<TSalesGroupUpdate, 'sales_group_name'>,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!salesGroupData.sales_group_name) {
            throw new BadRequestException('Missing required data...')
        }
        
        return await this.salesGroupService.updateSalesGroupNameById(
            req_organization_id,
            sales_group_id,
            salesGroupData.sales_group_name,
        );
    }
    
    
    @Patch('/territory/:sales_group_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaSalesGroupData))
    async updateSalesGroupTerritory(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('sales_group_id')
        sales_group_id: string,
        @Body()
        salesGroupData: Pick<TSalesGroupUpdate, 'sales_group_territory'>,
    ) {
        
        const req_organization_id = this.validateOrganization(req)
        
        if (!salesGroupData.sales_group_territory) {
            throw new BadRequestException('Missing required data...')
        }
        
        return await this.salesGroupService.updateSalesGroupTerritoryById(
            req_organization_id,
            sales_group_id,
            salesGroupData.sales_group_territory,
        );
    }
    
    
    @Delete('/:sales_group_id')
    async deleteSalesGroup(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('sales_group_id')
        sales_group_id: string,
    ) {
        
        const req_organization_id = this.validateOrganization(req)
        return await this.salesGroupService.deleteSalesGroupById(
            req_organization_id,
            sales_group_id,
        );
    }
    
    
    @Get('/:sales_group_id')
    async getSalesGroupProfile(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('sales_group_id')
        sales_group_id: string,
    ) {
        
        const req_organization_id = this.validateOrganization(req)
        return await this.salesGroupService.getSalesGroupDetailsById(
            req_organization_id,
            sales_group_id,
        );
    }
    
    
    @Get('/organization')
    async getSalesGroupsByOrganizationId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.salesGroupService.getSalesGroupsByOrganizationId(req_organization_id,);
    }
}
