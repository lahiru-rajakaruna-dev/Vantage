import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UnauthorizedException,
    UsePipes,
}                              from '@nestjs/common';
import {
    SchemaSalesGroupInsert,
    SchemaSalesGroupUpdate,
    TOrganizationSelect,
    TSalesGroupInsert,
    TSalesGroupUpdate
}                              from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import { SalesGroupService }   from './sales_group.service';



@Controller('sales-group')
export class SalesGroupController {
    private readonly salesGroupService: SalesGroupService;
    
    
    constructor(salesGroupService: SalesGroupService) {
        this.salesGroupService = salesGroupService
    }
    
    
    @Post()
    @UsePipes(new ZodSchemaValidationPipe(SchemaSalesGroupInsert.pick({
                                                                          sales_group_name     : true,
                                                                          sales_group_territory: true,
                                                                      })
                                                                .nonoptional()),)
    async addSalesGroup(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Body()
        salesGroupData: Pick<TSalesGroupInsert, 'sales_group_name' | 'sales_group_territory'>,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        const {
                  sales_group_name,
                  sales_group_territory
              } = salesGroupData
        
        if (!sales_group_name || !sales_group_territory) {
            throw new BadRequestException('Missing required data...')
        }
        
        return await this.salesGroupService.addSalesGroup(
            request.organization.organization_id,
            {
                sales_group_name     : salesGroupData.sales_group_name,
                sales_group_territory: salesGroupData.sales_group_territory,
            }
        );
    }
    
    
    @Patch('/update/name/:sales_group_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaSalesGroupUpdate.pick({ sales_group_name: true })
                                                                .nonoptional()),)
    async updateSalesGroupName(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('sales_group_id')
        sales_group_id: string,
        @Body()
        salesGroupData: Pick<TSalesGroupUpdate, 'sales_group_name'>,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        if (!salesGroupData.sales_group_name) {
            throw new BadRequestException('Missing required data...')
        }
        
        return await this.salesGroupService.updateSalesGroupNameById(
            request.organization.organization_id,
            sales_group_id,
            salesGroupData.sales_group_name,
        );
    }
    
    
    @Patch('/update/territory/:sales_group_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaSalesGroupUpdate.pick({ sales_group_territory: true })
                                                                .nonoptional()),)
    async updateSalesGroupTerritory(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('sales_group_id')
        sales_group_id: string,
        @Body()
        salesGroupData: Pick<TSalesGroupUpdate, 'sales_group_territory'>,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        if (!salesGroupData.sales_group_territory) {
            throw new BadRequestException('Missing required data...')
        }
        
        return await this.salesGroupService.updateSalesGroupTerritoryById(
            request.organization.organization_id,
            sales_group_id,
            salesGroupData.sales_group_territory,
        );
    }
    
    
    @Delete('/delete/:sales_group_id')
    async deleteSalesGroup(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('sales_group_id')
        sales_group_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.salesGroupService.deleteSalesGroupById(
            request.organization.organization_id,
            sales_group_id,
        );
    }
    
    
    @Get('/profile/:sales_group_id')
    async getSalesGroupProfile(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('sales_group_id')
        sales_group_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.salesGroupService.getSalesGroupDetailsById(
            request.organization.organization_id,
            sales_group_id,
        );
    }
    
    
    @Get('/view/organization')
    async getSalesGroupsByOrganizationId(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.salesGroupService.getSalesGroupsByOrganizationId(
            request.organization.organization_id,);
    }
}
