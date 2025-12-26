import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { OrmModule } from '../../orm/orm.module';
import { LoggerModule } from '../../logger/logger.module';
import { PaddleModule } from '../../paddle/paddle.module';

@Module({
  imports: [OrmModule, PaddleModule, LoggerModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
