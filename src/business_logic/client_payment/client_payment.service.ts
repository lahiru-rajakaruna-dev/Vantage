import {
    Inject,
    Injectable
}                             from '@nestjs/common';
import { v4 as uuid }         from 'uuid'
import {
    TClientPaymentData,
    TClientPaymentSelect
}                             from '../../orm/drizzle/drizzle-postgres/schema';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface     from '../../orm/orm.interface';
import { EPaymentStatus }     from '../../types';



@Injectable()
export class ClientPaymentService {
    private readonly orm: IOrmInterface;
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
        orm: IOrmInterface) {
        this.orm = orm;
    }
    
    
    //   ADD CLIENT PAYMENT
    // EDITED: Fixed parameters to match ORM interface
    async addClientPayment(
        organization_id: string, // Added missing parameter
        client_id: string,
        paymentDetails: TClientPaymentData // Changed type
    ): Promise<TClientPaymentSelect[]> { // Changed return type
        const client_payment_id = uuid()
            .toString()
        return this.orm.addClientPayment(
            organization_id,
            client_id,
            client_payment_id,
            paymentDetails,
        );
    }
    
    
    //   UPDATE CLIENT PAYMENT BY ID
    async updateClientPaymentStatusToPendingById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPaymentSelect[]> { // Fixed return type
        return this.orm.updateClientPaymentById(
            organization_id,
            payment_id,
            {
                client_payment_status: EPaymentStatus.PENDING,
            }
        );
    }
    
    
    async updateClientPaymentStatusToPaidById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPaymentSelect[]> { // Fixed return type
        return this.orm.updateClientPaymentById(
            organization_id,
            payment_id,
            {
                client_payment_status: EPaymentStatus.PAID,
            }
        );
    }
    
    
    async updateClientPaymentStatusToVerifiedById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPaymentSelect[]> { // Fixed return type
        return this.orm.updateClientPaymentById(
            organization_id,
            payment_id,
            {
                client_payment_status: EPaymentStatus.VERIFIED,
            }
        );
    }
    
    
    async updateClientPaymentStatusToRefundedById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPaymentSelect[]> { // Fixed return type
        return this.orm.updateClientPaymentById(
            organization_id,
            payment_id,
            {
                client_payment_status: EPaymentStatus.REFUNDED,
            }
        );
    }
    
    
    async updateClientPaymentAmountById(
        organization_id: string,
        payment_id: string,
        payment_amount: number,
    ): Promise<TClientPaymentSelect[]> { // Fixed return type
        return this.orm.updateClientPaymentById(
            organization_id,
            payment_id,
            {
                client_payment_amount: payment_amount
            }
        )
    }
    
    
    //   GET CLIENT PAYMENT BY ID
    async viewClientPaymentById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPaymentSelect> { // Fixed return type
        return this.orm.getClientPaymentById(
            organization_id,
            payment_id
        );
    }
    
    
    //   GET CLIENT PAYMENTS BY CLIENT_ID
    async getClientPaymentsByClientId(
        organization_id: string,
        client_id: string,
    ): Promise<TClientPaymentSelect[]> { // Fixed return type
        return this.orm.getClientPaymentsByClientId(
            organization_id,
            client_id
        );
    }
}
