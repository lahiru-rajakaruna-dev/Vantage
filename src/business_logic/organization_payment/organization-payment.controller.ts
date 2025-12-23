import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
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
    @Headers('organization_id') organization_id: string,
    @Body('payment_amount') payment_amount: number,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.paymentService.addOrganizationPayment({
      payment_id: uuid().toString(),
      payment_organization_id: organization_id,
      payment_amount: payment_amount.toString(),
      payment_timestamp: Date.now(),
      payment_status: EPaymentStatus.PAID,
    });
  }

  @Patch('/update/status/pending/:payment_id')
  updatePaymentStatusToPending(
    @Headers('organization_id') organization_id: string,
    @Param('payment_id') payment_id: string,
  ) {
    return this.paymentService.updateOrganizationPaymentStatusToPendingById(
      organization_id,
      payment_id,
    );
  }

  @Patch('/update/status/paid/:payment_id')
  updatePaymentStatusToPaid(
    @Headers('organization_id') organization_id: string,
    @Param('payment_id') payment_id: string,
  ) {
    return this.paymentService.updateOrganizationPaymentStatusToPaidById(
      organization_id,
      payment_id,
    );
  }

  @Patch('/update/status/verified/:payment_id')
  updatePaymentStatusToVerified(
    @Headers('organization_id') organization_id: string,
    @Param('payment_id') payment_id: string,
  ) {
    return this.paymentService.updateOrganizationPaymentStatusToVerifiedById(
      organization_id,
      payment_id,
    );
  }

  @Patch('/update/status/refunded/:payment_id')
  updatePaymentStatusToRefunded(
    @Headers('organization_id') organization_id: string,
    @Param('payment_id') payment_id: string,
  ) {
    return this.paymentService.updateOrganizationPaymentStatusToRefundedById(
      organization_id,
      payment_id,
    );
  }
}
