import { Inject, Injectable } from '@nestjs/common';
import type IOrmInterface from '../../orm/orm.interface';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import { TClientPayment } from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import { EPaymentStatus } from '../../types';

@Injectable()
export class ClientPaymentService {
  private readonly orm: IOrmInterface;

  constructor(@Inject(TOKEN__ORM_FACTORY) orm: IOrmInterface) {
    this.orm = orm;
  }

  //   ADD CLIENT PAYMENT
  async addClientPayment(
    paymentDetails: TClientPayment,
  ): Promise<TClientPayment> {
    return this.orm.addClientPayment(paymentDetails);
  }

  //   UPDATE CLIENT PAYMENT BY ID
  async updateClientPaymentStatusToPendingById(
    payment_id: string,
  ): Promise<TClientPayment> {
    return this.orm.updateClientPaymentById(payment_id, {
      client_payment_status: EPaymentStatus.PENDING,
    });
  }

  async updateClientPaymentStatusToPaidById(
    payment_id: string,
  ): Promise<TClientPayment> {
    return this.orm.updateClientPaymentById(payment_id, {
      client_payment_status: EPaymentStatus.PAID,
    });
  }

  async updateClientPaymentStatusToVerifiedById(
    payment_id: string,
  ): Promise<TClientPayment> {
    return this.orm.updateClientPaymentById(payment_id, {
      client_payment_status: EPaymentStatus.VERIFIED,
    });
  }

  async updateClientPaymentStatusToRefundedById(
    payment_id: string,
  ): Promise<TClientPayment> {
    return this.orm.updateClientPaymentById(payment_id, {
      client_payment_status: EPaymentStatus.REFUNDED,
    });
  }

  //   GET CLIENT PAYMENT BY ID
  async viewClientPaymentById(payment_id: string): Promise<TClientPayment> {
    return this.orm.getClientPaymentById(payment_id);
  }

  //   GET CLIENT PAYMENTS BY CLIENT_ID
  async getClientPaymentsByClientId(
    client_id: string,
  ): Promise<TClientPayment[]> {
    return this.orm.getClientPaymentsByClientId(client_id);
  }
}
