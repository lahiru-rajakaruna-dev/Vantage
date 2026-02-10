import {
    Inject,
    Injectable
}                             from '@nestjs/common';
import { v4 as uuid }         from 'uuid'
import {
    TSaleData,
    TSaleSelect,
    TSaleUpdate
}                             from '../../orm/drizzle/drizzle-postgres/schema';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface     from '../../orm/orm.interface';



@Injectable()
export class SaleService {
    private readonly orm: IOrmInterface;
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
        orm: IOrmInterface) {
        this.orm = orm;
    }
    
    
    async addSale(
        organization_id: string,
        employee_id: string,
        saleData: TSaleData
    ): Promise<TSaleSelect[]> {
        const sale_id = uuid()
            .toString()
        return await this.orm.addSale(
            organization_id,
            employee_id,
            sale_id,
            saleData
        );
    }
    
    
    async viewSaleById(
        organization_id: string,
        sale_id: string
    ): Promise<TSaleSelect> {
        return await this.orm.getSaleById(
            organization_id,
            sale_id
        );
    }
    
    
    async getSalesByEmployeeId(
        organization_id: string,
        employee_id: string,
    ): Promise<TSaleSelect[]> {
        return await this.orm.getSalesByEmployeeId(
            organization_id,
            employee_id
        );
    }
    
    
    async getSalesByItemId(
        organization_id: string,
        item_id: string,
    ): Promise<TSaleSelect[]> { // EDITED: Fixed return type
        return await this.orm.getSalesByItemId(
            organization_id,
            item_id
        );
    }
    
    
    async getSalesByClientId(
        organization_id: string,
        client_id: string,
    ): Promise<TSaleSelect[]> {
        return await this.orm.getSalesByClientId(
            organization_id,
            client_id
        );
    }
    
    
    async getSalesBySalesGroupId(
        organization_id: string,
        sales_group_id: string
    ): Promise<TSaleSelect[]> {
        return await this.orm.getSalesBySalesGroupId(
            organization_id,
            sales_group_id
        )
    }
    
    
    async getSalesByOrganizationId(organization_id: string): Promise<TSaleSelect[]> {
        return await this.orm.getSalesByOrganizationId(organization_id);
    }
    
    
    async getSalesByDate(
        organization_id: string,
        date: number,
    ): Promise<TSaleSelect[]> {
        return await this.orm.getSalesByDate(
            organization_id,
            date
        );
    }
    
    
    async getSalesWithinDates(
        organization_id: string,
        date_start: number,
        date_end: number,
    ): Promise<TSaleSelect[]> {
        return await this.orm.getSalesWithinDates(
            organization_id,
            date_start,
            date_end,
        );
    }
    
    
    async updateSaleById(
        organization_id: string,
        sale_id: string,
        saleUpdates: Omit<TSaleUpdate, 'sale_id' | 'sale_organization_id' | 'sale_employee_id'>,
    ): Promise<TSaleSelect[]> {
        return await this.orm.updateSaleById(
            organization_id,
            sale_id,
            saleUpdates
        );
    }
}
