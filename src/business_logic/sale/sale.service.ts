import { Inject, Injectable } from '@nestjs/common';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface     from '../../orm/orm.interface';
import { type TSale }         from '../../orm/orm.interface';



@Injectable()
export class SaleService {
  private readonly orm: IOrmInterface;

  constructor(@Inject(TOKEN__ORM_FACTORY) orm: IOrmInterface) {
    this.orm = orm;
  }

  async addSale(saleData: TSale): Promise<TSale[]> {
    return await this.orm.addSaleItem(saleData);
  }

  async viewSale(organization_id: string, sale_id: string): Promise<TSale> {
    return await this.orm.viewSaleById(organization_id, sale_id);
  }

  async getSalesByEmployeeId(
    organization_id: string,
    employee_id: string,
  ): Promise<TSale[]> {
    return await this.orm.getSalesByEmployeeId(organization_id, employee_id);
  }

  async getSalesByItemId(
    organization_id: string,
    item_id: string,
  ): Promise<TSale[]> {
    return await this.orm.getSalesByItemId(organization_id, item_id);
  }

  async getSalesByClientId(
    organization_id: string,
    client_id: string,
  ): Promise<TSale[]> {
    return await this.orm.getSalesByClientId(organization_id, client_id);
  }

  async getSalesByOrganizationId(organization_id: string): Promise<TSale[]> {
    return await this.orm.getSalesByOrganizationId(organization_id);
  }

  async getSalesByDate(
    organization_id: string,
    date: number,
  ): Promise<TSale[]> {
    return await this.orm.getSalesByDate(organization_id, date);
  }
  async getSalesWithinDates(
    organization_id: string,
    date_start: number,
    date_end: number,
  ): Promise<TSale[]> {
    return await this.orm.getSalesWithinDates(
      organization_id,
      date_start,
      date_end,
    );
  }
}
