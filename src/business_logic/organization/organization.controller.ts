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
import { Business, Customer } from '@paddle/paddle-node-sdk';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import type ILoggerService from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import { PaddleService } from '../../paddle/paddle.service';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import { type TOrganization } from '../../schemas';
import { EOrganizationStatus, ESubscriptionStatus } from '../../types';
import { OrganizationService } from './organization.service';

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
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({
        organization_name: z.string().nonoptional(),
        organization_logo_url: z.string().nonoptional(),
        organization_admin_email: z.email().nonoptional(),
        organization_admin_phone: z.string(),
      }),
    ),
  )
  async addOrganization(
    @Headers('user_id') user_id: string,
    @Body()
    organizationData: {
      organization_name: string;
      organization_admin_email: string;
      organization_logo_url: string;
      organization_admin_phone: string;
    },
  ) {
    const {
      organization_name,
      organization_logo_url,
      organization_admin_email,
      organization_admin_phone,
    } = organizationData;

    if (
      !organization_name ||
      !organization_logo_url ||
      !organization_admin_email ||
      !organization_admin_phone
    ) {
      throw new BadRequestException(
        '[-] Invalid request. Required data is missing...',
      );
    }

    let paddleCustomerAccount: Customer;
    let paddleBusinessAccount: Business;

    // ADD PADDLE CUSTOMER ACCOUNT
    try {
      paddleCustomerAccount = await this.paddle.addCustomerAccount(
        organization_name,
        organization_admin_email,
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
        organization_admin_phone,
      );
    } catch (e) {
      this.logger.log(e);
      throw new InternalServerErrorException((e as Error).message);
    }
    this.logger.log('[+] Add organization payment account to the platform');

    // ADD ORGANIZATION RECORD
    try {
      const organizationRecord = await this.organizationService.addOrganization(
        {
          organization_id: uuid().toString(),
          organization_admin_id: user_id,
          organization_stripe_customer_id: paddleCustomerAccount.id,
          organization_name,
          organization_admin_email,
          organization_admin_phone,
          organization_logo_url,
          organization_status: EOrganizationStatus.ACTIVE,
          organization_subscription_status: ESubscriptionStatus.VALID,
          organization_registration_date: Date.now(),
          organization_subscription_end_date:
            Date.now() + 28 * 24 * 60 * 60 * 1000,
        },
      );

      this.logger.log(organizationRecord);

      return organizationRecord;
    } catch (e) {
      this.logger.log(e);
      throw new InternalServerErrorException(`[-] ${(e as Error).message}`);
    }
  }

  @Patch('/update/name')
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({
        organization_name: z.string().nonempty().nonoptional(),
      }),
    ),
  )
  updateOrganizationById(
    @Headers('organization_id') organization_id: string,
    @Body() organizationData: Pick<TOrganization, 'organization_name'>,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.organizationService.updateOrganizationNameById(
      organization_id,
      organizationData.organization_name,
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
  extendOrganizationSubscriptionEndDateBy30ById(
    @Headers('organization_id') organization_id: string,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.organizationService.setOrganizationSubscriptionEndDateBy30ById(
      organization_id,
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
