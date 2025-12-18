import { Module } from '@nestjs/common';
import { ClientPaymentService } from './client_payment.service';
import { ClientPaymentController } from './client_payment.controller';

@Module({
  providers: [ClientPaymentService],
  controllers: [ClientPaymentController],
})
export class ClientPaymentModule {}
