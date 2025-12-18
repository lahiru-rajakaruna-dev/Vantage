import { Inject, Injectable } from '@nestjs/common';
import type IOrmInterface from '../../orm/orm.interface';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import { TSalesGroup } from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';

@Injectable()
export class SalesGroupService {
  private readonly orm: IOrmInterface;

  constructor(@Inject(TOKEN__ORM_FACTORY) orm: IOrmInterface) {
    this.orm = orm;
  }

  async addSalesGroup(salesGroupData: TSalesGroup): Promise<TSalesGroup> {
    return await this.orm.addSalesGroup(salesGroupData);
  }

  async getSalesGroupsByOrganizationId(
    organization_id: string,
  ): Promise<TSalesGroup | undefined> {
    return await this.orm.getSalesGroupsByOrganizationId(organization_id);
  }

  async updateSalesGroupNameById(
    sales_group_id: string,
    sales_group_name: string,
  ): Promise<TSalesGroup> {
    return await this.orm.updateSalesGroupById(sales_group_id, {
      sales_group_name: sales_group_name,
    });
  }

  async deleteSalesGroupById(sales_group_id: string): Promise<TSalesGroup> {
    return await this.orm.deleteSalesGroupById(sales_group_id);
  }
}
