import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { type TSale } from '../../orm/orm.interface';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import { SaleService } from './sale.service';

@Controller('sale')
export class SaleController {
  private readonly saleService: SaleService;

  constructor(@Inject() saleService: SaleService) {
    this.saleService = saleService;
  }

  @Post('/add')
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({
        sale_employee_id: z.string().nonempty().nonoptional(),
        sale_client_id: z.string().nonempty().nonoptional(),
        sale_client_payment_id: z.string().nonempty().nonoptional(),
        sale_item_id: z.string().nonempty().nonoptional(),
        sale_item_unit_count: z.string().nonempty().nonoptional(),
      }),
    ),
  )
  async addSale(
    @Headers('organization_id') organization_id: string,
    @Body() saleData: TSale,
  ): Promise<TSale[]> {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return await this.saleService.addSale({
      sale_id: uuid().toString(),
      sale_organization_id: organization_id,
      sale_employee_id: saleData.sale_employee_id,
      sale_client_id: saleData.sale_client_id,
      sale_client_payment_id: saleData.sale_client_payment_id,
      sale_item_id: saleData.sale_item_id,
      sale_item_unit_count: saleData.sale_item_unit_count,
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
    @Headers('organization_id') organization_id: string,
    @Param('employee_id') employee_id: string,
  ): Promise<TSale[]> {
    return await this.saleService.getSalesByEmployeeId(
      organization_id,
      employee_id,
    );
  }

  @Get('/view/item/:item_id')
  async getSalesByItemId(
    @Headers('organization_id') organization_id: string,
    @Param('item_id') item_id: string,
  ): Promise<TSale[]> {
    return await this.saleService.getSalesByItemId(organization_id, item_id);
  }

  @Get('/view/client/:client_id')
  async getSalesByClientId(
    @Headers('organization_id') organization_id: string,
    @Param('client_id') client_id: string,
  ): Promise<TSale[]> {
    return await this.saleService.getSalesByClientId(
      organization_id,
      client_id,
    );
  }

  @Get('/view/date/:date')
  async getSalesByDate(
    @Headers('organization_id') organization_id: string,
    @Param('date') date: number,
  ): Promise<TSale[]> {
    return await this.saleService.getSalesByDate(organization_id, date);
  }

  @Get('/view/date-range/:date_start/:dat_-end')
  async getSalesByDateRange(
    @Headers('organization_id') organization_id: string,
    @Param('date_start') date_start: number,
    @Param('date_end') date_end: number,
  ): Promise<TSale[]> {
    return await this.saleService.getSalesWithinDates(
      organization_id,
      date_start,
      date_end,
    );
  }
}
