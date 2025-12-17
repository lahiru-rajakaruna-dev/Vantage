import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { OrganizationModule } from './organization/organization.module';
import { PaymentModule } from './payment/payment.module';
import { ItemModule } from './item/item.module';
import { SalesGroupModule } from './sales_group/sales_group.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { OrmModule } from './orm/orm.module';
import { DrizzleModule } from './orm/drizzle/drizzle.module';

@Module({
  imports: [
    EmployeeModule,
    OrganizationModule,
    PaymentModule,
    ItemModule,
    SalesGroupModule,
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
