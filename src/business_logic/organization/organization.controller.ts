import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { EOrganizationStatus, ESubscriptionStatus } from '../../types';

@Controller('organization')
export class OrganizationController {
  private organizationService: OrganizationService;
  private configService: ConfigService;

  constructor(
    @Inject() configService: ConfigService,
    @Inject() organizationService: OrganizationService,
  ) {
    this.organizationService = organizationService;
    this.configService = configService;
  }

  @Get('/view')
  getOrganizationById(@Req() request: Request) {
    return this.organizationService.getOrganizationDetailsById(
      request.headers['organization_id'],
    );
  }

  @Post('/add')
  addOrganization(@Body('organization_name') organization_name: string) {
    return this.organizationService.addOrganization({
      organization_id:
        this.configService.get('NODE_ENV') === 'DEVELOPMENT'
          ? '0000-000-000'
          : uuid().toString(),
      organization_name: organization_name,
      organization_status: EOrganizationStatus.ACTIVE,
      organization_subscription_status: ESubscriptionStatus.VALID,
      organization_stripe_customer_id: uuid().toString(),
      organization_registration_date: Date.now(),
      organization_subscription_end_date: Date.now() + 28 * 24 * 60 * 60 * 1000,
    });
  }

  @Patch('/update/name')
  updateOrganizationById(
    @Req() request: Request,
    @Body('organization_name') organization_name: string,
  ) {
    return this.organizationService.updateOrganizationNameById(
      request.headers['organization_id'],
      organization_name,
    );
  }

  @Patch('/update/subscription/expired')
  updateOrganizationSubscriptionStatusToExpiredById(@Req() request: Request) {
    return this.organizationService.setOrganizationSubscriptionStatusToExpiredById(
      request.headers['organization_id'],
    );
  }

  @Patch('/update/subscription/valid')
  updateOrganizationSubscriptionStatusToValidById(@Req() request: Request) {
    return this.organizationService.setOrganizationSubscriptionStatusToValidById(
      request.headers['organization_id'],
    );
  }

  @Patch('/update/subscription/date')
  updateOrganizationSubscriptionEndDateById(
    @Req() request: Request,
    @Body('organization_subscription_end_date')
    organization_subscription_end_date: number,
  ) {
    return this.organizationService.setOrganizationSubscriptionEndDateById(
      request.headers['organization_id'],
      organization_subscription_end_date,
    );
  }

  @Delete('/deactivate')
  deactivateOrganizationById(@Req() request: Request) {
    return this.organizationService.deactivateOrganizationById(
      request.headers['organization_id'],
    );
  }

  @Patch('/activate/:organization_id')
  activateOrganizationById(organization_id: string) {
    return this.organizationService.activateOrganizationById(organization_id);
  }
}
