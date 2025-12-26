import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { OrmModule } from '../../orm/orm.module';
import { StripeModule } from '../../stripe/stripe.module';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [OrmModule, StripeModule, LoggerModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
