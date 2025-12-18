import { Module } from '@nestjs/common';
import { OrganizationPaymentController } from './organization-payment.controller';
import { OrganizationPaymentService } from './organization-payment.service';
import { OrmModule } from '../../orm/orm.module';

@Module({
  imports: [OrmModule],
  controllers: [OrganizationPaymentController],
  providers: [OrganizationPaymentService],
})
export class OrganizationPaymentModule {}
