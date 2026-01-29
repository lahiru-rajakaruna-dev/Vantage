import { Module }       from '@nestjs/common';
import {
    OrganizationModule
}                       from '../business_logic/organization/organization.module';
import { LoggerModule } from '../logger/logger.module';
import {
    Middleware_OrganizationPuller
}                       from './organization_puller.middleware';



@Module({
  imports: [OrganizationModule, LoggerModule],
  providers: [Middleware_OrganizationPuller],
  exports: [Middleware_OrganizationPuller],
})
export class MiddlewareModule {}
