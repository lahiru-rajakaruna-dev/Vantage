import { Inject, Injectable } from '@nestjs/common';
import type IOrmInterface from '../../orm/orm.interface';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import { TOrganizationPayment } from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import { EPaymentStatus } from '../../types';

@Injectable()
export class OrganizationPaymentService {
  private readonly orm: IOrmInterface;

  constructor(@Inject(TOKEN__ORM_FACTORY) orm: IOrmInterface) {
    this.orm = orm;
  }

  async addOrganizationPayment(
    paymentData: TOrganizationPayment,
  ): Promise<TOrganizationPayment> {
    return this.orm.addOrganizationPayment(paymentData);
  }

  async getOrganizationPaymentsByOrganizationId(
    organization_id: string,
  ): Promise<TOrganizationPayment[]> {
    return this.orm.getOrganizationPaymentsByOrganizationId(organization_id);
  }

  async updateOrganizationPaymentStatusToPendingById(
    organization_id: string,
    payment_id: string,
  ): Promise<TOrganizationPayment> {
    return this.orm.updateOrganizationPaymentById(organization_id, payment_id, {
      payment_status: EPaymentStatus.PENDING,
    });
  }

  async updateOrganizationPaymentStatusToPaidById(
    organization_id: string,
    payment_id: string,
  ): Promise<TOrganizationPayment> {
    return this.orm.updateOrganizationPaymentById(organization_id, payment_id, {
      payment_status: EPaymentStatus.PAID,
    });
  }

  async updateOrganizationPaymentStatusToVerifiedById(
    organization_id: string,
    payment_id: string,
  ): Promise<TOrganizationPayment> {
    return this.orm.updateOrganizationPaymentById(organization_id, payment_id, {
      payment_status: EPaymentStatus.VERIFIED,
    });
  }

  async updateOrganizationPaymentStatusToRefundedById(
    organization_id: string,
    payment_id: string,
  ): Promise<TOrganizationPayment> {
    return this.orm.updateOrganizationPaymentById(organization_id, payment_id, {
      payment_status: EPaymentStatus.REFUNDED,
    });
  }
}
