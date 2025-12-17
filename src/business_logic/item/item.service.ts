import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type IOrmInterface from '../../orm/orm.interface';
import { TOKEN__ORM_FACTORY } from 'src/orm/orm-factory/orm-factory.service';
import { TItem } from 'src/orm/drizzle/drizzle-postgres/drizzle-postgres.schema';

@Injectable()
export class ItemService {
  private orm: IOrmInterface;

  constructor(@Inject(TOKEN__ORM_FACTORY) orm: IOrmInterface) {
    this.orm = orm;
  }

  async addItem(itemData: TItem): Promise<TItem> {
    return await this.orm.addItem(itemData);
  }

  async viewItemById(item_id: string): Promise<TItem> {
    const item = await this.orm.viewItemById(item_id);
    if (!item) {
      throw new NotFoundException(`Item with ID "${item_id}" not found`);
    }
    return item;
  }

  async getItemsByOrganizationId(organization_id: string): Promise<TItem[]> {
    return this.orm.getItemsByOrganizationId(organization_id);
  }

  async updateItemNameById(item_id: string, item_name: string): Promise<TItem> {
    const updatedItem = await this.orm.updateItemById(item_id, {
      item_name: item_name,
    });
    if (!updatedItem) {
      throw new NotFoundException(`Item with ID "${item_id}" not found`);
    }
    return updatedItem;
  }

  async updateItemStockById(
    item_id: string,
    item_stock_units: number,
  ): Promise<TItem> {
    const updatedItem = await this.orm.updateItemById(item_id, {
      item_stock_unit_count: item_stock_units,
    });
    if (!updatedItem) {
      throw new NotFoundException(`Item with ID "${item_id}" not found`);
    }
    return updatedItem;
  }

  async deleteItemsByIds(item_ids: string[]): Promise<TItem[]> {
    const deletedItems = await Promise.all(
      item_ids.map(async (item_id) => {
        const deletedItem = await this.orm.deleteItemById(item_id);

        if (!deletedItem) {
          throw new NotFoundException(`Item with ID "${item_id}" not found`);
        }

        return deletedItem;
      }),
    );

    return deletedItems;
  }
}
