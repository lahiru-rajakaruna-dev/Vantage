import {
    Inject,
    Injectable,
    NotFoundException
}                             from '@nestjs/common';
import { TOKEN__ORM_FACTORY } from 'src/orm/orm-factory/orm-factory.service';
import { v4 as uuid }         from 'uuid'
import {
    TItemInsert,
    TItemSelect
}                             from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import type IOrmInterface     from '../../orm/orm.interface';



@Injectable()
export class ItemService {
    private orm: IOrmInterface;
    
    
    constructor(@Inject(TOKEN__ORM_FACTORY) orm: IOrmInterface) {
        this.orm = orm;
    }
    
    
    async addItem(
        organization_id: string,
        itemData: Omit<TItemInsert, 'item_organization_id' | 'item_id'>
    ): Promise<TItemSelect[]> {
        return await this.orm.addItem(
            organization_id,
            {
                ...itemData,
                item_id: uuid()
                    .toString()
            }
        );
    }
    
    
    async viewItemById(
        organization_id: string,
        item_id: string
    ): Promise<TItemSelect> {
        const item = await this.orm.getItemById(
            organization_id,
            item_id
        );
        
        if (!item) {
            throw new NotFoundException(`Item with ID "${ item_id }" not found`);
        }
        
        return item;
    }
    
    
    async getItemsByOrganizationId(
        organization_id: string
    ): Promise<TItemSelect[]> {
        return this.orm.getItemsByOrganizationId(organization_id);
    }
    
    
    async updateItemNameById(
        organization_id: string,
        item_id: string,
        item_name: string,
    ): Promise<TItemSelect[]> {
        const updatedItem = await this.orm.updateItemById(
            organization_id,
            item_id,
            {
                item_name: item_name,
            }
        );
        
        if (!updatedItem || updatedItem.length === 0) {
            throw new NotFoundException(`Item with ID "${ item_id }" not found`);
        }
        
        return updatedItem;
    }
    
    
    async updateItemStockById(
        organization_id: string,
        item_id: string,
        item_stock_units: number,
    ): Promise<TItemSelect[]> {
        const updatedItem = await this.orm.updateItemById(
            organization_id,
            item_id,
            {
                item_stock_unit_count: item_stock_units,
            }
        );
        
        if (!updatedItem || updatedItem.length === 0) {
            throw new NotFoundException(`Item with ID "${ item_id }" not found`);
        }
        
        return updatedItem;
    }
}
