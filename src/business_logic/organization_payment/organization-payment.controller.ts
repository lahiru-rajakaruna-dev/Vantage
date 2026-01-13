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
  UsePipes,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { type TOrganizationPayment } from '../../orm/orm.interface';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import { EPaymentStatus } from '../../types';
import { OrganizationPaymentService } from './organization-payment.service';

@Controller('organization_payment')
export class OrganizationPaymentController {
  private paymentService: OrganizationPaymentService;

  constructor(@Inject() paymentService: OrganizationPaymentService) {
    this.paymentService = paymentService;
  }

  @Get('/view/:organization_id')
  async getPaymentsByOrganizationId(
    @Param('organization_id') organization_id: string,
  ) {
    return await this.paymentService.getOrganizationPaymentsByOrganizationId(
      organization_id,
    );
  }

  @Post('/add')
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({
        payment_amount: z.string().nonoptional(),
      }),
    ),
  )
  async addPayment(
    @Headers('organization_id') organization_id: string,
    @Body() paymentData: TOrganizationPayment,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return await this.paymentService.addOrganizationPayment({
      payment_id: uuid().toString(),
      payment_organization_id: organization_id,
      payment_amount: paymentData.payment_amount as string,
      payment_timestamp: Date.now(),
      payment_status: EPaymentStatus.PAID,
    });
  }

  @Patch('/update/status/pending/:payment_id')
  async updatePaymentStatusToPending(
    @Headers('organization_id') organization_id: string,
    @Param('payment_id') payment_id: string,
  ) {
    return await this.paymentService.updateOrganizationPaymentStatusToPendingById(
      organization_id,
      payment_id,
    );
  }

  @Patch('/update/status/paid/:payment_id')
  async updatePaymentStatusToPaid(
    @Headers('organization_id') organization_id: string,
    @Param('payment_id') payment_id: string,
  ) {
    return await this.paymentService.updateOrganizationPaymentStatusToPaidById(
      organization_id,
      payment_id,
    );
  }

  @Patch('/update/status/verified/:payment_id')
  async updatePaymentStatusToVerified(
    @Headers('organization_id') organization_id: string,
    @Param('payment_id') payment_id: string,
  ) {
    return await this.paymentService.updateOrganizationPaymentStatusToVerifiedById(
      organization_id,
      payment_id,
    );
  }

  @Patch('/update/status/refunded/:payment_id')
  async updatePaymentStatusToRefunded(
    @Headers('organization_id') organization_id: string,
    @Param('payment_id') payment_id: string,
  ) {
    return await this.paymentService.updateOrganizationPaymentStatusToRefundedById(
      organization_id,
      payment_id,
    );
  }
}
