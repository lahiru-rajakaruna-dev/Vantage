import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UnauthorizedException,
    UsePipes,
}                              from '@nestjs/common';
import {
    SchemaInsertItem,
    SchemaUpdateItem,
    type   TItemInsert,
    TItemUpdate,
    TOrganizationSelect
}                              from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import { ItemService }         from './item.service';



@Controller('item')
export class ItemController {
    private readonly itemService: ItemService;
    
    
    // EDITED: Removed incorrect @Inject() decorator
    constructor(itemService: ItemService) {
        this.itemService = itemService;
    }
    
    
    @Post()
    @UsePipes(
        new ZodSchemaValidationPipe(
            SchemaInsertItem.pick({
                                      item_name            : true,
                                      item_stock_unit_count: true,
                                  })
                            .nonoptional()
        ),
    )
    async addItem(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Body() itemData: Omit<TItemInsert, 'item_organization_id' | 'item_id'> // EDITED: Fixed type to match service
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.itemService.addItem(
            request.organization.organization_id,
            {
                item_name            : itemData.item_name,
                item_stock_unit_count: itemData.item_stock_unit_count,
            }
        );
    }
    
    
    @Patch('/update/name/:item_id')
    @UsePipes(
        new ZodSchemaValidationPipe(
            SchemaUpdateItem.pick({ item_name: true })
                            .nonoptional()
        ),
    )
    async updateItemName(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('item_id') item_id: string,
        @Body('item_name') item_name: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        if (!item_id) {
            throw new BadRequestException('Item id not found');
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
            SchemaUpdateItem.pick({ item_stock_unit_count: true })
                            .nonoptional()
        ),
    )
    async updateItemStock(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('item_id') item_id: string,
        @Body() itemData: Pick<TItemUpdate, 'item_stock_unit_count'>, // EDITED:
                                                                      // Fixed
                                                                      // type
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        if (!item_id) {
            throw new BadRequestException('Item id not found');
        }
        
        if (!itemData.item_stock_unit_count) {
            throw new BadRequestException('Missing required data')
        }
        
        return await this.itemService.updateItemStockById(
            request.organization.organization_id,
            item_id,
            itemData.item_stock_unit_count,
        );
    }
    
    
    @Get('/profile/:item_id')
    async getItemProfile(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('item_id') item_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        if (!item_id) {
            throw new BadRequestException('Item id not found');
        }
        
        return await this.itemService.viewItemById(
            request.organization.organization_id,
            item_id,
        );
    }
    
    
    @Get('/view/organization')
    async getItemsByOrganizationId(
        @Req() request: Request & {
            organization: TOrganizationSelect
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
