import {
    Inject,
    Injectable
}                             from '@nestjs/common';
import { v4 as uuid }         from 'uuid'
import {
    TClientPaymentData,
    TClientPaymentSelect,
    TClientPaymentUpdate
}                             from '../../orm/drizzle/drizzle-postgres/schema';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface     from '../../orm/orm.interface';



@Injectable()
export class ClientPaymentService {
    private readonly orm: IOrmInterface;
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
        orm: IOrmInterface) {
        this.orm = orm;
    }
    
    
    async addClientPayment(
        organization_id: string,
        client_id: string,
        paymentDetails: TClientPaymentData
    ): Promise<TClientPaymentSelect[]> {
        const client_payment_id = uuid()
            .toString()
        return this.orm.addClientPayment(
            organization_id,
            client_id,
            client_payment_id,
            paymentDetails,
        );
    }
    
    
    async updateClientPayment(
        organization_id: string,
        payment_id: string,
        paymentUpdates: TClientPaymentUpdate,
    ): Promise<TClientPaymentSelect[]> { // Fixed return type
        return this.orm.updateClientPaymentById(
            organization_id,
            payment_id,
            paymentUpdates
        )
    }
    
    
    async viewClientPaymentById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPaymentSelect> {
        return this.orm.getClientPaymentById(
            organization_id,
            payment_id
        );
    }
    
    
    async getClientPaymentsByClientId(
        organization_id: string,
        client_id: string,
    ): Promise<TClientPaymentSelect[]> {
        return this.orm.getClientPaymentsByClientId(
            organization_id,
            client_id
        );
    }
}
