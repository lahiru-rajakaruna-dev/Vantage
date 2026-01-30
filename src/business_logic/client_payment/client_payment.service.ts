import { Inject, Injectable } from '@nestjs/common';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface from '../../orm/orm.interface';
import { type TClientPayment } from '../../orm/orm.interface';
import { EPaymentStatus } from '../../types';



@Injectable()
export class ClientPaymentService {
    private readonly orm: IOrmInterface;
    
    
    constructor(@Inject(TOKEN__ORM_FACTORY) orm: IOrmInterface) {
        this.orm = orm;
    }
    
    
    //   ADD CLIENT PAYMENT
    async addClientPayment(paymentDetails: TClientPayment,): Promise<TClientPayment[]> {
        return this.orm.addClientPayment(paymentDetails);
    }
    
    
    //   UPDATE CLIENT PAYMENT BY ID
    async updateClientPaymentStatusToPendingById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPayment[]> {
        return this.orm.updateClientPaymentById(organization_id, payment_id, {
            client_payment_status: EPaymentStatus.PENDING,
        });
    }
    
    
    async updateClientPaymentStatusToPaidById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPayment[]> {
        return this.orm.updateClientPaymentById(organization_id, payment_id, {
            client_payment_status: EPaymentStatus.PAID,
        });
    }
    
    
    async updateClientPaymentStatusToVerifiedById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPayment[]> {
        return this.orm.updateClientPaymentById(organization_id, payment_id, {
            client_payment_status: EPaymentStatus.VERIFIED,
        });
    }
    
    
    async updateClientPaymentStatusToRefundedById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPayment[]> {
        return this.orm.updateClientPaymentById(organization_id, payment_id, {
            client_payment_status: EPaymentStatus.REFUNDED,
        });
    }
    
    
    //   GET CLIENT PAYMENT BY ID
    async viewClientPaymentById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPayment> {
        return this.orm.getClientPaymentById(organization_id, payment_id);
    }
    
    
    //   GET CLIENT PAYMENTS BY CLIENT_ID
    async getClientPaymentsByClientId(
        organization_id: string,
        client_id: string,
    ): Promise<TClientPayment[]> {
        return this.orm.getClientPaymentsByClientId(organization_id, client_id);
    }
}
