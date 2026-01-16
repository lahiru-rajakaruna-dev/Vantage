import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { ClientModule } from './business_logic/client/client.module';
import { ClientPaymentModule } from './business_logic/client_payment/client_payment.module';
import { EmployeeModule } from './business_logic/employee/employee.module';
import { ItemModule } from './business_logic/item/item.module';
import { OrganizationModule } from './business_logic/organization/organization.module';
import { OrganizationPaymentModule } from './business_logic/organization_payment/organization-payment.module';
import { SaleModule } from './business_logic/sale/sale.module';
import { SalesGroupModule } from './business_logic/sales_group/sales_group.module';
import { LoggerModule } from './logger/logger.module';
import { DrizzleModule } from './orm/drizzle/drizzle.module';
import { OrmModule } from './orm/orm.module';
import { PaddleModule } from './paddle/paddle.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 1000 * 60 * 60,
    }),
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
    PaddleModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
