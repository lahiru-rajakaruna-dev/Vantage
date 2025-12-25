import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import type ILoggerService from '../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../logger/logger_factory/logger_factory.service';

@Injectable()
export class StripeService {
  protected stripeClient: Stripe;
  private readonly configService: ConfigService;
  private readonly logger: ILoggerService;

  constructor(
    @Inject() configService: ConfigService,
    @Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService,
  ) {
    this.configService = configService;
    this.logger = logger;
    this.stripeClient = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY') as string,
    );

    this.logger.log(this.stripeClient);
  }

  async addOrganization(
    organization_email: string,
    organization_name: string,
    organization_phone: string,
  ) {
    try {
      return await this.stripeClient.v2.core.accounts.create({
        contact_email: organization_email,
        display_name: organization_name,
        configuration: {
          merchant: {
            capabilities: {
              card_payments: { requested: true },
            },
          },
        },
        identity: {
          business_details: {
            phone: organization_phone,
          },
          entity_type: 'company',
        },
        defaults: {
          currency: 'USD',
          locales: ['en-US'],
          responsibilities: {
            fees_collector: 'stripe',
            losses_collector: 'stripe',
          },
        },
        dashboard: 'full',
      });
    } catch (e) {
      this.logger.log(JSON.stringify(e));
      throw new InternalServerErrorException(`[-] ${(e as Error).message}`);
    }
  }

  async onBoardOrganizationToThePlatform(account_id: string) {
    try {
      return await this.stripeClient.v2.core.accountLinks.create({
        account: account_id,
        use_case: {
          type: 'account_onboarding',
          account_onboarding: {
            refresh_url: 'localhost:3000',
            return_url: 'localhost:3000',
            configurations: ['customer', 'merchant'],
          },
        },
      });
    } catch (e) {
      this.logger.log(JSON.stringify(e));
      throw new InternalServerErrorException(`[-] ${(e as Error).message}`);
    }
  }
}
