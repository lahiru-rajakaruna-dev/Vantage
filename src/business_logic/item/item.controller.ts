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
} from '@nestjs/common';
import { ItemService } from './item.service';
import { v4 as uuid } from 'uuid';

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

  @Post()
  async addItem(
    @Headers('organization_id') organization_id: string,
    @Body('item_name') item_name: string,
    @Body('item_stock_unit_count') item_stock_unit_count: number,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return await this.itemService.addItem({
      item_id: uuid().toString(),
      item_organization_id: organization_id,
      item_name: item_name,
      item_stock_unit_count: item_stock_unit_count,
    });
  }

  @Patch('/update/name/:item_id')
  async updateItemNameById(
    @Headers('organization_id') organization_id: string,
    @Param('item_id') item_id: string,
    @Body('item_name') item_name: string,
  ) {
    return await this.itemService.updateItemNameById(
      organization_id,
      item_id,
      item_name,
    );
  }

  @Patch('/update/stock/:item_id')
  async updateItemStockById(
    @Headers('organization_id') organization_id: string,
    @Param('item_id') item_id: string,
    @Body('item_stock_units') item_stock_units: number,
  ) {
    return await this.itemService.updateItemStockById(
      organization_id,
      item_id,
      item_stock_units,
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
