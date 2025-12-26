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
import type ILoggerService from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import { SchemaOrganization, type TOrganization } from '../../schemas';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import { PaddleService } from '../../paddle/paddle.service';
import { Business, Customer } from '@paddle/paddle-node-sdk';

@Controller('organization')
export class OrganizationController {
  private organizationService: OrganizationService;
  private readonly logger: ILoggerService;
  private readonly paddle: PaddleService;

  constructor(
    @Inject() organizationService: OrganizationService,
    @Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService,
    @Inject() paddle: PaddleService,
  ) {
    this.organizationService = organizationService;
    this.logger = logger;
    this.paddle = paddle;
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
  async addOrganization(@Body() organizationData: TOrganization) {
    const { organization_name, organization_email, organization_phone } =
      organizationData;

    if (!organization_name || !organization_email || !organization_phone) {
      throw new BadRequestException(
        '[-] Invalid request. Property organization_name is missing...',
      );
    }

    let paddleCustomerAccount: Customer;
    let paddleBusinessAccount: Business;

    // ADD PADDLE CUSTOMER ACCOUNT
    try {
      paddleCustomerAccount = await this.paddle.addCustomerAccount(
        organization_name,
        organization_email,
      );
    } catch (e) {
      this.logger.log(e);
      throw new InternalServerErrorException((e as Error).message);
    }

    // ADD PADDLE BUSINESS ACCOUNT
    try {
      paddleBusinessAccount = await this.paddle.addOrganizationAccount(
        paddleCustomerAccount.id,
        organization_name,
        organization_phone,
      );
    } catch (e) {
      this.logger.log(e);
      throw new InternalServerErrorException((e as Error).message);
    }

    // ADD ORGANIZATION RECORD
    try {
      const organizationRecord = await this.organizationService.addOrganization(
        {
          organization_id: uuid().toString(),
          organization_stripe_customer_id: paddleCustomerAccount.id,
          organization_name,
          organization_email,
          organization_phone,
          organization_status: EOrganizationStatus.ACTIVE,
          organization_subscription_status: ESubscriptionStatus.VALID,
          organization_registration_date: Date.now(),
          organization_subscription_end_date:
            Date.now() + 28 * 24 * 60 * 60 * 1000,
        },
      );

      this.logger.log('[+] Add organization stripe account to the platform');
      this.logger.log(organizationRecord);

      return organizationRecord;
    } catch (e) {
      this.logger.log(e);
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
