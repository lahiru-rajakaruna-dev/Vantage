import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { OrganizationPaymentService } from './organization-payment.service';
import { EPaymentStatus } from '../../types';

@Controller('organization_payment')
export class OrganizationPaymentController {
  private paymentService: OrganizationPaymentService;

  constructor(@Inject() paymentService: OrganizationPaymentService) {
    this.paymentService = paymentService;
  }

  @Get('/view/:organization_id')
  getPaymentsByOrganizationId(
    @Param('organization_id') organization_id: string,
  ) {
    return this.paymentService.getOrganizationPaymentsByOrganizationId(
      organization_id,
    );
  }

  @Post('/add/')
  addPayment(
    @Req() request: Request,
    @Body('payment_amount') payment_amount: number,
  ) {
    return this.paymentService.addOrganizationPayment({
      payment_id: uuid().toString(),
      payment_organization_id: request.headers['organization_id'],
      payment_amount: payment_amount.toString(),
      payment_timestamp: Date.now(),
      payment_status: EPaymentStatus.PAID,
    });
  }

  @Patch('/update/status/pending/:payment_id')
  updatePaymentStatusToPending(@Param('payment_id') payment_id: string) {
    return this.paymentService.updateOrganizationPaymentStatusToPendingById(
      payment_id,
    );
  }

  @Patch('/update/status/paid/:payment_id')
  updatePaymentStatusToPaid(@Param('payment_id') payment_id: string) {
    return this.paymentService.updateOrganizationPaymentStatusToPaidById(
      payment_id,
    );
  }

  @Patch('/update/status/verified/:payment_id')
  updatePaymentStatusToVerified(@Param('payment_id') payment_id: string) {
    return this.paymentService.updateOrganizationPaymentStatusToVerifiedById(
      payment_id,
    );
  }

  @Patch('/update/status/refunded/:payment_id')
  updatePaymentStatusToRefunded(@Param('payment_id') payment_id: string) {
    return this.paymentService.updateOrganizationPaymentStatusToRefundedById(
      payment_id,
    );
  }
}
