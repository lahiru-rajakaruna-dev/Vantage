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
    SchemaSalesGroupUpdate,
    TOrganizationSelect,
    type TSalesGroupData,
    type   TSalesGroupUpdate
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import ZodSchemaValidationPipe   from '../../pipes/schema_validation.pipe';
import { BaseController }        from '../abstract.base.controller';
import { SalesGroupService }     from './sales_group.service';



@Controller('sales-groups')
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
    
    
    @Get('/:sales_group_id')
    async getSalesGroupProfile(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
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
            organization: TOrganizationSelect,
            user_id: string
        },) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.salesGroupService.getSalesGroupsByOrganizationId(req_organization_id,);
    }
    
    
    @Post()
    @UsePipes(new ZodSchemaValidationPipe(SchemaSalesGroupData))
    async addSalesGroup(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Body()
        salesGroupData: TSalesGroupData,
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
    
    
    @Patch('/:sales_group_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaSalesGroupUpdate))
    async updateSalesGroupName(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Param('sales_group_id')
        sales_group_id: string,
        @Body()
        salesGroupUpdates: TSalesGroupUpdate,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.salesGroupService.updateSalesGroup(
            req_organization_id,
            sales_group_id,
            salesGroupUpdates,
        );
    }
    
    
    @Delete('/:sales_group_id')
    async deleteSalesGroup(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
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
    
}
