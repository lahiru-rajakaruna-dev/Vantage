import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { OrmModule } from '../../orm/orm.module';
import { PaddleModule } from '../../paddle/paddle.module';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [OrmModule, PaddleModule, LoggerModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
