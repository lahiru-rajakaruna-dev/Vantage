import {
    Inject,
    Injectable
}                             from '@nestjs/common';
import { v4 as uuid }         from 'uuid'
import {
    TSalesGroupInsert,
    TSalesGroupSelect,
    TSalesGroupUpdate
}                             from '../../orm/drizzle/drizzle-postgres/schema';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface     from '../../orm/orm.interface';



@Injectable()
export class SalesGroupService {
    private readonly orm: IOrmInterface;
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
        orm: IOrmInterface) {
        this.orm = orm;
    }
    
    
    async addSalesGroup(
        organization_id: string,
        salesGroupData: Pick<TSalesGroupInsert, 'sales_group_name' | 'sales_group_territory'>
    ): Promise<TSalesGroupSelect[]> {
        const sales_group_id = uuid()
            .toString()
        return await this.orm.addSalesGroup(
            organization_id,
            sales_group_id,
            salesGroupData,
        );
    }
    
    
    async getSalesGroupsByOrganizationId(organization_id: string,): Promise<TSalesGroupSelect[]> {
        return await this.orm.getSalesGroupsByOrganizationId(organization_id);
    }
    
    
    async getSalesGroupDetailsById(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TSalesGroupSelect> { // EDITED: Added proper return type to match ORM interface
        return await this.orm.getSalesGroupDetailsById(
            organization_id,
            sales_group_id
        );
    }
    
    
    async updateSalesGroup(
        organization_id: string,
        sales_group_id: string,
        salesGroupUpdates: TSalesGroupUpdate,
    ): Promise<TSalesGroupSelect[]> {
        return await this.orm.updateSalesGroupById(
            organization_id,
            sales_group_id,
            salesGroupUpdates,
        );
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
