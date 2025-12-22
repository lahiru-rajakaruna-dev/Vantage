import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Patch,
  Post,
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
  getOrganizationById(@Headers('organization_id') organization_id: string) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.organizationService.getOrganizationDetailsById(organization_id);
  }

  @Post('/add')
  addOrganization(@Body('organization_name') organization_name: string) {
    if (!organization_name) {
      throw new BadRequestException(
        '[-] Invalid request. Property organization_name is missing...',
      );
    }

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
    @Headers('organization_id') organization_id: string,
    @Body('organization_name') organization_name: string,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.organizationService.updateOrganizationNameById(
      organization_id,
      organization_name,
    );
  }

  @Patch('/update/subscription/expired')
  updateOrganizationSubscriptionStatusToExpiredById(
    @Headers('organization_id') organization_id: string,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.organizationService.setOrganizationSubscriptionStatusToExpiredById(
      organization_id,
    );
  }

  @Patch('/update/subscription/valid')
  updateOrganizationSubscriptionStatusToValidById(
    @Headers('organization_id') organization_id: string,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.organizationService.setOrganizationSubscriptionStatusToValidById(
      organization_id,
    );
  }

  @Patch('/update/subscription/date')
  updateOrganizationSubscriptionEndDateById(
    @Headers('organization_id') organization_id: string,
    @Body('organization_subscription_end_date')
    organization_subscription_end_date: number,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.organizationService.setOrganizationSubscriptionEndDateById(
      organization_id,
      organization_subscription_end_date,
    );
  }

  @Delete('/deactivate')
  deactivateOrganizationById(
    @Headers('organization_id') organization_id: string,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.organizationService.deactivateOrganizationById(organization_id);
  }

  @Patch('/activate/:organization_id')
  activateOrganizationById(organization_id: string) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.organizationService.activateOrganizationById(organization_id);
  }
}
