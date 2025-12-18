import { Inject, Injectable } from '@nestjs/common';
import type IOrmInterface from '../../orm/orm.interface';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import { TSale } from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';

@Injectable()
export class SaleService {
  private readonly orm: IOrmInterface;

  constructor(@Inject(TOKEN__ORM_FACTORY) orm: IOrmInterface) {
    this.orm = orm;
  }

  async addSale(saleData: TSale): Promise<TSale> {
    return await this.orm.addSaleItem(saleData);
  }

  async viewSale(sale_id: string): Promise<TSale> {
    return await this.orm.viewSaleById(sale_id);
  }

  async getSalesByEmployeeId(employee_id: string): Promise<TSale[]> {
    return await this.orm.getSalesByEmployeeId(employee_id);
  }

  async getSalesByItemId(item_id: string): Promise<TSale[]> {
    return await this.orm.getSalesByItemId(item_id);
  }

  async getSalesByClientId(client_id: string): Promise<TSale[]> {
    return await this.orm.getSalesByClientId(client_id);
  }

  async getSalesByOrganizationId(organization_id: string): Promise<TSale[]> {
    return await this.orm.getSalesByOrganizationId(organization_id);
  }

  async getSalesByDate(date: number): Promise<TSale[]> {
    return await this.orm.getSalesByDate(date);
  }
  async getSalesWithinDates(
    date_start: number,
    date_end: number,
  ): Promise<TSale[]> {
    return await this.orm.getSalesWithinDates(date_start, date_end);
  }
}
