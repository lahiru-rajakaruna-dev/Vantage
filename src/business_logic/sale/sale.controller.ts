import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { v4 as uuid } from 'uuid';
import { TSale } from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';

@Controller('sale')
export class SaleController {
  private readonly saleService: SaleService;

  constructor(@Inject() saleService: SaleService) {
    this.saleService = saleService;
  }

  @Post('/add')
  async addSale(
    @Headers('organization_id') organization_id: string,
    @Body('sale_employee_id') sale_employee_id: string,
    @Body('sale_client_id') sale_client_id: string,
    @Body('sale_client_payment_id') sale_client_payment_id: string,
    @Body('sale_item_id') sale_item_id: string,
    @Body('sale_item_unit_count') sale_item_unit_count: number,
  ): Promise<TSale> {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return await this.saleService.addSale({
      sale_id: uuid().toString(),
      sale_organization_id: organization_id,
      sale_employee_id,
      sale_client_id,
      sale_client_payment_id,
      sale_item_id,
      sale_item_unit_count,
      sale_date: Date.now(),
    });
  }

  @Get('/view/organization')
  async getSalesByOrganizationId(
    @Headers('organization_id') organization_id: string,
  ): Promise<TSale[]> {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return await this.saleService.getSalesByOrganizationId(organization_id);
  }

  @Get('/view/employee/:employee_id')
  async getSalesByEmployeeId(
    @Param('employee_id') employee_id: string,
  ): Promise<TSale[]> {
    return await this.saleService.getSalesByEmployeeId(employee_id);
  }

  @Get('/view/item/:item_id')
  async getSalesByItemId(@Param('item_id') item_id: string): Promise<TSale[]> {
    return await this.saleService.getSalesByItemId(item_id);
  }

  @Get('/view/client/:client_id')
  async getSalesByClientId(
    @Param('client_id') client_id: string,
  ): Promise<TSale[]> {
    return await this.saleService.getSalesByClientId(client_id);
  }

  @Get('/view/date/:date')
  async getSalesByDate(@Param('date') date: number): Promise<TSale[]> {
    return await this.saleService.getSalesByDate(date);
  }

  @Get('/view/date-range/:date_start/:dat_-end')
  async getSalesByDateRange(
    @Param('date_start') date_start: number,
    @Param('date_end') date_end: number,
  ): Promise<TSale[]> {
    return await this.saleService.getSalesWithinDates(date_start, date_end);
  }
}
