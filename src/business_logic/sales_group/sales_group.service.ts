import {
    Inject,
    Injectable
}                             from '@nestjs/common';
import { v4 as uuid }         from 'uuid'
import {
    TSalesGroupInsert,
    TSalesGroupSelect
}                             from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface     from '../../orm/orm.interface';



@Injectable()
export class SalesGroupService {
    private readonly orm: IOrmInterface;
    
    
    constructor(@Inject(TOKEN__ORM_FACTORY) orm: IOrmInterface) {
        this.orm = orm;
    }
    
    
    async addSalesGroup(
        organization_id: string,
        salesGroupData: Pick<TSalesGroupInsert, 'sales_group_name' | 'sales_group_territory'>
    ): Promise<TSalesGroupSelect[]> {
        return await this.orm.addSalesGroup(
            organization_id,
            {
                ...salesGroupData,
                sales_group_id             : uuid()
                    .toString(),
                sales_group_organization_id: organization_id
            }
        );
    }
    
    
    async getSalesGroupsByOrganizationId(organization_id: string,): Promise<TSalesGroupSelect[]> {
        return await this.orm.getSalesGroupsByOrganizationId(organization_id);
    }
    
    
    async getSalesGroupDetailsById(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TSalesGroupSelect> {
        return await this.orm.getSalesGroupDetailsById(
            organization_id,
            sales_group_id,
        );
    }
    
    
    async updateSalesGroupNameById(
        organization_id: string,
        sales_group_id: string,
        sales_group_name: string,
    ): Promise<TSalesGroupSelect[]> {
        return await this.orm.updateSalesGroupById(
            organization_id,
            sales_group_id,
            {
                sales_group_name: sales_group_name,
            },
        );
    }
    
    
    async updateSalesGroupTerritoryById(
        organization_id: string,
        sales_group_id: string,
        sales_group_territory: string
    ): Promise<TSalesGroupSelect[]> {
        return await this.orm.updateSalesGroupById(
            organization_id,
            sales_group_id,
            {
                sales_group_territory: sales_group_territory
            }
        )
    }
    
    
    async deleteSalesGroupById(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TSalesGroupSelect[]> {
        return await this.orm.deleteSalesGroupById(
            organization_id,
            sales_group_id
        );
    }
}
