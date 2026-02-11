import {
    Inject,
    Injectable
}                             from '@nestjs/common';
import { v4 as uuid }         from 'uuid'
import {
    TOrganizationPaymentInsert,
    TOrganizationPaymentSelect,
    TOrganizationPaymentUpdate
}                             from '../../orm/drizzle/drizzle-postgres/schema';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface     from '../../orm/orm.interface';



@Injectable()
export class OrganizationPaymentService {
    private readonly orm: IOrmInterface;
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
        orm: IOrmInterface) {
        this.orm = orm;
    }
    
    
    async addOrganizationPayment(
        organization_id: string,
        paymentData: Omit<TOrganizationPaymentInsert, 'organization_payment_organization_id' | 'organization_payment_id'>
    ): Promise<TOrganizationPaymentSelect[]> {
        const organization_payment_id = uuid()
            .toString()
        return await this.orm.addOrganizationPayment(
            organization_id,
            organization_payment_id,
            paymentData,
        );
    }
    
    
    async getOrganizationPaymentById(
        organization_id: string,
        payment_id: string
    ): Promise<TOrganizationPaymentSelect> {
        return await this.orm.getOrganizationPaymentById(
            organization_id,
            payment_id
        );
    }
    
    
    async getOrganizationPaymentsByOrganizationId(organization_id: string,): Promise<TOrganizationPaymentSelect[]> {
        return this.orm.getOrganizationPaymentsByOrganizationId(organization_id);
    }
    
    
    async updateOrganizationPayment(
        organization_id: string,
        payment_id: string,
        paymentUpdates: TOrganizationPaymentUpdate
    ): Promise<TOrganizationPaymentSelect[]> {
        return this.orm.updateOrganizationPaymentById(
            organization_id,
            payment_id,
            paymentUpdates
        );
    }
}
