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
    Query,
    Req,
    UnauthorizedException,
    UsePipes,
}                                    from '@nestjs/common';
import { v4 as uuid }                from 'uuid';
import { type TItem }                from '../../orm/orm.interface';
import ZodSchemaValidationPipe       from '../../pipes/schema_validation.pipe';
import { ItemSchema, TOrganization } from '../../schemas';
import { ItemService }               from './item.service';



@Controller('item')
export class ItemController {
    private readonly itemService: ItemService;
    
    
    constructor(@Inject() itemService: ItemService) {
        this.itemService = itemService;
    }
    
    
    @Post()
    @UsePipes(
        new ZodSchemaValidationPipe(
            ItemSchema.pick({
                                item_name            : true,
                                item_stock_unit_count: true,
                            })
        ),
    )
    async addItem(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Body() itemData: TItem,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.itemService.addItem({
                                                  item_id              : uuid()
                                                      .toString(),
                                                  item_organization_id : request.organization.organization_id,
                                                  item_name            : itemData.item_name,
                                                  item_stock_unit_count: itemData.item_stock_unit_count ||
                                                                         0,
                                              });
    }
    
    
    @Patch('/update/name/:item_id')
    @UsePipes(
        new ZodSchemaValidationPipe(
            ItemSchema.pick({ item_name: true })
        ),
    )
    async updateItemName(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('item_id') item_id: string,
        @Body('item_name') item_name: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.itemService.updateItemNameById(
            request.organization.organization_id,
            item_id,
            item_name,
        );
    }
    
    
    @Patch('/update/stock/:item_id')
    @UsePipes(
        new ZodSchemaValidationPipe(
            ItemSchema.pick({ item_stock_unit_count: true })
        ),
    )
    async updateItemStock(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('item_id') item_id: string,
        @Body() itemData: {
            item_stock_unit_count: number
        },
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.itemService.updateItemStockById(
            request.organization.organization_id,
            item_id,
            itemData.item_stock_unit_count,
        );
    }
    
    
    @Delete('/delete/:item_id')
    async deleteItem(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('item_id') item_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.itemService.deleteItemById(
            request.organization.organization_id,
            item_id,
        );
    }
    
    
    @Delete('/delete-batch')
    async deleteItemsBatch(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Query('item_ids') item_ids: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        const itemIdsArray = item_ids.split(',').map(id => id.trim());
        return await this.itemService.deleteItemsByIds(
            request.organization.organization_id,
            itemIdsArray,
        );
    }
    
    
    @Get('/profile/:item_id')
    async getItemProfile(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('item_id') item_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.itemService.viewItemById(
            request.organization.organization_id,
            item_id,
        );
    }
    
    
    @Get('/view/organization')
    async getItemsByOrganizationId(
        @Req() request: Request & {
            organization: TOrganization
        },
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.itemService.getItemsByOrganizationId(
            request.organization.organization_id,
        );
    }
}
