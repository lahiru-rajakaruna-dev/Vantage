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
import { ClientPaymentService } from './client_payment.service';

@Controller('client-payment')
export class ClientPaymentController {
  private readonly clientPaymentService: ClientPaymentService;

  constructor(@Inject() clientPaymentService: ClientPaymentService) {
    this.clientPaymentService = clientPaymentService;
  }

  //   ADD CLIENT PAYMENT
  @Post('/add')
  async addClientPayment(
    @Headers('organization_id') organization_id: string,
    @Body('client_id') client_id: string,
    @Body('client_payment_amount') client_payment_amount: number,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return await this.clientPaymentService.addClientPayment({
      client_payment_id: uuid().toString(),
      client_payment_organization_id: organization_id,
      client_payment_client_id: client_id,
      client_payment_amount: client_payment_amount,
      client_payment_date: Date.now(),
    });
  }

  //   SET CLIENT PAYMENT STATUS TO PENDING
  @Patch('/update/status/pending/:payment_id')
  async setClientPaymentStatusToPending(
    @Headers('organization_id') organization_id: string,
    @Param() payment_id: string,
  ) {
    return await this.clientPaymentService.updateClientPaymentStatusToPendingById(
      organization_id,
      payment_id,
    );
  }

  //   SET CLIENT PAYMENT STATUS TO PAID
  @Patch('/update/status/paid/:payment_id')
  async setClientPaymentStatusToPaid(
    @Headers('organization_id') organization_id: string,
    @Param('payment_id') payment_id: string,
  ) {
    return await this.clientPaymentService.updateClientPaymentStatusToPaidById(
      organization_id,
      payment_id,
    );
  }

  //   SET CLIENT PAYMENT STATUS TO VERIFIED
  @Patch('/update/status/verified/:payment_id')
  async setClientPaymentStatusToVerified(
    @Headers('organization_id') organization_id: string,
    @Param('payment_id') payment_id: string,
  ) {
    return await this.clientPaymentService.updateClientPaymentStatusToVerifiedById(
      organization_id,
      payment_id,
    );
  }

  //   SET CLIENT PAYMENT STATUS TO REFUNDED
  @Patch('/update/status/refunded/:payment_id')
  async setClientPaymentStatusToRefunded(
    @Headers('organization_id') organization_id: string,
    @Param('payment_id') payment_id: string,
  ) {
    return await this.clientPaymentService.updateClientPaymentStatusToRefundedById(
      organization_id,
      payment_id,
    );
  }

  //   VIEW CLIENT PAYMENT BY ID
  @Get('/view/:payment_id')
  async viewClientPayment(
    @Headers('organization_id') organization_id: string,
    @Param('payment_id') payment_id: string,
  ) {
    return await this.clientPaymentService.viewClientPaymentById(
      organization_id,
      payment_id,
    );
  }

  //   GET CLIENT PAYMENTS BY CLIENT ID
  @Get('/view/client/:client_id')
  async viewClientPayments(
    @Headers('organization_id') organization_id: string,
    @Param('client_id') client_id: string,
  ) {
    return await this.clientPaymentService.getClientPaymentsByClientId(
      organization_id,
      client_id,
    );
  }
}
