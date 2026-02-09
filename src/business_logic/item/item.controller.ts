import {
    BadRequestException,
    Body,
    Controller,
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
    SchemaItemData,
    SchemaItemUpdate,
    type TItemData,
    type TItemUpdate,
    TOrganizationSelect
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import ZodSchemaValidationPipe   from '../../pipes/schema_validation.pipe';
import { BaseController }        from '../abstract.base.controller';
import { ItemService }           from './item.service';



@Controller('item')
export class ItemController extends BaseController {
    private readonly itemService: ItemService;
    
    
    constructor(
        itemService: ItemService,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService
    ) {
        super(logger)
        this.itemService = itemService;
    }
    
    
    @Post()
    @UsePipes(new ZodSchemaValidationPipe(SchemaItemData))
    async addItem(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Body()
        itemData: TItemData
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.itemService.addItem(
            req_organization_id,
            {
                item_name            : itemData.item_name,
                item_stock_unit_count: itemData.item_stock_unit_count,
            }
        );
    }
    
    
    @Patch('/update/name/:item_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaItemUpdate.pick({ item_name: true })
                                                          .nonoptional()),)
    async updateItemName(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('item_id')
        item_id: string,
        @Body('item_name')
        item_name: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!item_id) {
            throw new BadRequestException('Item id not found');
        }
        
        return await this.itemService.updateItemNameById(
            req_organization_id,
            item_id,
            item_name,
        );
    }
    
    
    @Patch('/update/stock/:item_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaItemUpdate.pick({ item_stock_unit_count: true })
                                                          .nonoptional()),)
    async updateItemStock(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('item_id')
        item_id: string,
        @Body()
        itemData: Pick<TItemUpdate, 'item_stock_unit_count'>, // EDITED:
                                                              // Fixed
                                                              // type
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!item_id) {
            throw new BadRequestException('Item id not found');
        }
        
        if (!itemData.item_stock_unit_count) {
            throw new BadRequestException('Missing required data')
        }
        
        return await this.itemService.updateItemStockById(
            req_organization_id,
            item_id,
            itemData.item_stock_unit_count,
        );
    }
    
    
    @Get('/profile/:item_id')
    async getItemProfile(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('item_id')
        item_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!item_id) {
            throw new BadRequestException('Item id not found');
        }
        
        return await this.itemService.viewItemById(
            req_organization_id,
            item_id,
        );
    }
    
    
    @Get('/view/organization')
    async getItemsByOrganizationId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },) {
        const req_organization_id = this.validateOrganization(req)
        return await this.itemService.getItemsByOrganizationId(req_organization_id,);
    }
}
