import { Module } from '@nestjs/common';
import { OrganizationPaymentController } from './organization-payment.controller';
import { OrganizationPaymentService } from './organization-payment.service';

@Module({
  controllers: [OrganizationPaymentController],
  providers: [OrganizationPaymentService],
})
export class OrganizationPaymentModule {}
