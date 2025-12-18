import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { OrmModule } from './orm/orm.module';
import { DrizzleModule } from './orm/drizzle/drizzle.module';
import { EmployeeModule } from './business_logic/employee/employee.module';
import { OrganizationPaymentModule } from './business_logic/organization_payment/organization-payment.module';
import { ClientPaymentModule } from './business_logic/client_payment/client_payment.module';
import { OrganizationModule } from './business_logic/organization/organization.module';
import { ItemModule } from './business_logic/item/item.module';
import { SalesGroupModule } from './business_logic/sales_group/sales_group.module';
import { ClientModule } from './business_logic/client/client.module';
import { SaleModule } from './business_logic/sale/sale.module';

@Module({
  imports: [
    EmployeeModule,
    OrganizationModule,
    OrganizationPaymentModule,
    ClientPaymentModule,
    ItemModule,
    SalesGroupModule,
    ClientModule,
    SaleModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true,
    }),
    LoggerModule,
    DrizzleModule,
    OrmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
