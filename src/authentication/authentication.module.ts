import { Module }                   from '@nestjs/common';
import { ConfigModule }             from '@nestjs/config';
import { OrganizationModule }       from '../business_logic/organization/organization.module';
import { LoggerModule }             from '../logger/logger.module';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [ConfigModule, OrganizationModule, LoggerModule],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
