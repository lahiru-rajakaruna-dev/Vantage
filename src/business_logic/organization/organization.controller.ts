import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  InternalServerErrorException,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { v4 as uuid } from 'uuid';
import { EOrganizationStatus, ESubscriptionStatus } from '../../types';
import { StripeService } from '../../stripe/stripe.service';
import type ILoggerService from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import { SchemaOrganization } from '../../schemas';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';

@Controller('organization')
export class OrganizationController {
  private organizationService: OrganizationService;
  private readonly logger: ILoggerService;
  private readonly stripe: StripeService;

  constructor(
    @Inject() organizationService: OrganizationService,
    @Inject() stripe: StripeService,
    @Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService,
  ) {
    this.organizationService = organizationService;
    this.logger = logger;
    this.stripe = stripe;
  }

  @Get('/view')
  async getOrganizationById(
    @Headers('organization_id') organization_id: string,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return await this.organizationService.getOrganizationDetailsById(
      organization_id,
    );
  }

  @Post('/add')
  @UsePipes(new ZodSchemaValidationPipe(SchemaOrganization))
  async addOrganization(
    @Body('organization_name') organization_name: string,
    @Body('organization_email') organization_email: string,
    @Body('organization_phone') organization_phone: string,
  ) {
    if (!organization_name) {
      throw new BadRequestException(
        '[-] Invalid request. Property organization_name is missing...',
      );
    }

    try {
      const organizationRecord = await this.organizationService.addOrganization(
        {
          organization_id: uuid().toString(),
          organization_name: organization_name,
          organization_email: organization_email,
          organization_phone: organization_phone,
          organization_status: EOrganizationStatus.ACTIVE,
          organization_subscription_status: ESubscriptionStatus.VALID,
          organization_stripe_customer_id: uuid().toString(),
          organization_registration_date: Date.now(),
          organization_subscription_end_date:
            Date.now() + 28 * 24 * 60 * 60 * 1000,
        },
      );

      const organizationStripeAccount = await this.stripe.addOrganization(
        organizationRecord.organization_email,
        organizationRecord.organization_name,
        organizationRecord.organization_phone,
      );

      const organizationOnboardingDetails =
        await this.stripe.onBoardOrganizationToThePlatform(
          organizationStripeAccount.id,
        );

      return organizationOnboardingDetails;
    } catch (e) {
      this.logger.log(JSON.stringify(e));
      throw new InternalServerErrorException(`[-] ${(e as Error).message}`);
    }
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
