import { Module } from '@nestjs/common';
import { ClientPaymentService } from './client_payment.service';
import { ClientPaymentController } from './client_payment.controller';
import { OrmModule } from '../../orm/orm.module';

@Module({
  imports: [OrmModule],
  providers: [ClientPaymentService],
  controllers: [ClientPaymentController],
})
export class ClientPaymentModule {}
