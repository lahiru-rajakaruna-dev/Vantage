import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TOKEN__ORM_FACTORY } from 'src/orm/orm-factory/orm-factory.service';
import type IOrmInterface from '../../orm/orm.interface';
import { type TItem } from '../../orm/orm.interface';

@Injectable()
export class ItemService {
  private orm: IOrmInterface;

  constructor(@Inject(TOKEN__ORM_FACTORY) orm: IOrmInterface) {
    this.orm = orm;
  }

  async addItem(itemData: TItem): Promise<TItem> {
    return await this.orm.addItem(itemData);
  }

  async viewItemById(organization_id: string, item_id: string): Promise<TItem> {
    const item = await this.orm.viewItemById(organization_id, item_id);

    if (!item) {
      throw new NotFoundException(`Item with ID "${item_id}" not found`);
    }

    return item;
  }

  async getItemsByOrganizationId(organization_id: string): Promise<TItem[]> {
    return this.orm.getItemsByOrganizationId(organization_id);
  }

  async updateItemNameById(
    organization_id: string,
    item_id: string,
    item_name: string,
  ): Promise<TItem> {
    const updatedItem = await this.orm.updateItemById(
      organization_id,
      item_id,
      {
        item_name: item_name,
      },
    );
    if (!updatedItem) {
      throw new NotFoundException(`Item with ID "${item_id}" not found`);
    }
    return updatedItem;
  }

  async updateItemStockById(
    organization_id: string,
    item_id: string,
    item_stock_units: number,
  ): Promise<TItem> {
    const updatedItem = await this.orm.updateItemById(
      organization_id,
      item_id,
      {
        item_stock_unit_count: item_stock_units,
      },
    );

    if (!updatedItem) {
      throw new NotFoundException(`Item with ID "${item_id}" not found`);
    }

    return updatedItem;
  }

  async deleteItemsByIds(
    organization_id: string,
    item_ids: string[],
  ): Promise<TItem[]> {
    return await Promise.all(
      item_ids.map(async (item_id) => {
        return await this.orm.deleteItemById(organization_id, item_id);
      }),
    );
  }
}
