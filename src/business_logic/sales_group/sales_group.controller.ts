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
    UnauthorizedException,
    UsePipes,
}                                          from '@nestjs/common';
import { v4 as uuid }                      from 'uuid';
import { type TSalesGroup }                from '../../orm/orm.interface';
import ZodSchemaValidationPipe
                                           from '../../pipes/schema_validation.pipe';
import { SalesGroupSchema, TOrganization } from '../../schemas';
import { SalesGroupService }               from './sales_group.service';



@Controller('sales-group')
export class SalesGroupController {
    private readonly salesGroupService: SalesGroupService;
    
    
    constructor(@Inject() salesGroupService: SalesGroupService) {
        this.salesGroupService = salesGroupService;
    }
    
    
    @Post()
    @UsePipes(
        new ZodSchemaValidationPipe(
            SalesGroupSchema.pick({
                                      sales_group_name     : true,
                                      sales_group_territory: true,
                                  })
        ),
    )
    async addSalesGroup(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Body() salesGroupData: TSalesGroup,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.salesGroupService.addSalesGroup({
                                                              sales_group_id             : uuid()
                                                                  .toString(),
                                                              sales_group_organization_id: request.organization.organization_id,
                                                              sales_group_name           : salesGroupData.sales_group_name,
                                                              sales_group_territory      : salesGroupData.sales_group_territory,
                                                          });
    }
    
    
    @Patch('/update/name/:sales_group_id')
    @UsePipes(
        new ZodSchemaValidationPipe(
            SalesGroupSchema.pick({ sales_group_name: true })
        ),
    )
    async updateSalesGroupName(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('sales_group_id') sales_group_id: string,
        @Body('sales_group_name') sales_group_name: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.salesGroupService.updateSalesGroupNameById(
            request.organization.organization_id,
            sales_group_id,
            sales_group_name,
        );
    }
    
    
    @Patch('/update/territory/:sales_group_id')
    @UsePipes(
        new ZodSchemaValidationPipe(
            SalesGroupSchema.pick({ sales_group_territory: true })
        ),
    )
    async updateSalesGroupTerritory(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('sales_group_id') sales_group_id: string,
        @Body() salesGroupData: {
            sales_group_territory: string
        },
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.salesGroupService.updateSalesGroupTerritoryById(
            request.organization.organization_id,
            sales_group_id,
            salesGroupData.sales_group_territory,
        );
    }
    
    
    @Delete('/delete/:sales_group_id')
    async deleteSalesGroup(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('sales_group_id') sales_group_id: string,
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
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('sales_group_id') sales_group_id: string,
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
        @Req() request: Request & {
            organization: TOrganization
        },
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.salesGroupService.getSalesGroupsByOrganizationId(
            request.organization.organization_id,
        );
    }
}
