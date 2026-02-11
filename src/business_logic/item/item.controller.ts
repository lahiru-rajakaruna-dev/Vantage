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



@Controller('items')
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
    
    
    @Get('/:item_id')
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
    
    
    @Get('/organization')
    async getItemsByOrganizationId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },) {
        const req_organization_id = this.validateOrganization(req)
        return await this.itemService.getItemsByOrganizationId(req_organization_id,);
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
    
    
    @Patch('/:item_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaItemUpdate))
    async updateItemName(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('item_id')
        item_id: string,
        @Body()
        itemUpdates: TItemUpdate,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!item_id) {
            throw new BadRequestException('Item id not found');
        }
        
        return await this.itemService.updateItem(
            req_organization_id,
            item_id,
            itemUpdates,
        );
    }
    
}
