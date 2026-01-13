import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { type TItem } from '../../orm/orm.interface';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  private itemService: ItemService;

  constructor(@Inject() itemService: ItemService) {
    this.itemService = itemService;
  }

  @Get('/:item_id')
  getItemById(
    @Headers('organization_id') organization_id: string,
    @Param('item_id') item_id: string,
  ) {
    return this.itemService.viewItemById(organization_id, item_id);
  }

  @Get('/organization/:organization_id')
  getItemsByOrganizationId(@Param('organization_id') organization_id: string) {
    return this.itemService.getItemsByOrganizationId(organization_id);
  }

  @Post('/add')
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({
        item_name: z.string().nonempty().nonoptional(),
        item_stock_unit_count: z.int().nonoptional().default(1),
      }),
    ),
  )
  async addItem(
    @Headers('organization_id') organization_id: string,
    @Body() itemData: TItem,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    const { item_name, item_stock_unit_count } = itemData;

    return await this.itemService.addItem({
      item_id: uuid().toString(),
      item_organization_id: organization_id,
      item_name: item_name,
      item_stock_unit_count: item_stock_unit_count,
    });
  }

  @Patch('/update/name/:item_id')
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({ item_name: z.string().nonempty().nonoptional() }),
    ),
  )
  async updateItemNameById(
    @Headers('organization_id') organization_id: string,
    @Param('item_id') item_id: string,
    @Body() itemData: Pick<TItem, 'item_name'>,
  ) {
    return await this.itemService.updateItemNameById(
      organization_id,
      item_id,
      itemData.item_name,
    );
  }

  @Patch('/update/stock/:item_id')
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({ item_stock_unit_count: z.int().nonoptional() }),
    ),
  )
  async updateItemStockById(
    @Headers('organization_id') organization_id: string,
    @Param('item_id') item_id: string,
    @Body() itemData: Pick<TItem, 'item_stock_unit_count'>,
  ) {
    return await this.itemService.updateItemStockById(
      organization_id,
      item_id,
      itemData.item_stock_unit_count!,
    );
  }

  @Delete('/delete/')
  async deleteItemsByIds(
    @Headers('organization_id') organization_id: string,
    @Query('item_ids') item_ids: string[],
  ) {
    return await this.itemService.deleteItemsByIds(organization_id, item_ids);
  }
}
