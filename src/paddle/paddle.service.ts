import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment, LogLevel, Paddle } from '@paddle/paddle-node-sdk';
import type ILoggerService from '../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../logger/logger_factory/logger_factory.service';
import { EEnvVars, ENodeEnv } from '../types';

@Injectable()
export class PaddleService {
  private readonly paddle: Paddle;
  private readonly configService: ConfigService;
  private readonly logger: ILoggerService;

  constructor(
    @Inject() configService: ConfigService,
    @Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService,
  ) {
    this.configService = configService;
    this.logger = logger;
    this.paddle = new Paddle(
      (this.configService.get(EEnvVars.NODE_ENV) as ENodeEnv) ===
        ENodeEnv.DEVELOPMENT
        ? (this.configService.get(
            EEnvVars.PADDLE_DEVELOPMENT_API_KEY,
          ) as string)
        : (this.configService.get(
            EEnvVars.PADDLE_PRODUCTION_API_KEY,
          ) as string),
      {
        environment:
          (this.configService.get(EEnvVars.NODE_ENV) as ENodeEnv) ===
          ENodeEnv.DEVELOPMENT
            ? Environment.sandbox
            : Environment.production,
        logLevel: LogLevel.verbose,
      },
    );

    this.logger.log('[+] Paddle payment service initialized...');
  }

  async addOrganizationAccount(
    paddleCustomerAccountId: string,
    organization_name: string,
    organization_phone: string,
  ) {
    try {
      const paddleBusinessAccountData = await this.paddle.businesses.create(
        paddleCustomerAccountId,
        {
          name: organization_name,
          companyNumber: organization_phone,
        },
      );

      this.logger.log(paddleBusinessAccountData);

      return paddleBusinessAccountData;
    } catch (e) {
      this.logger.log(e);
      throw new InternalServerErrorException((e as Error).message);
    }
  }

  async addCustomerAccount(name: string, email: string) {
    try {
      const paddleCustomerAccount = await this.paddle.customers.create({
        name: name,
        email: email,
        locale: 'en-US',
      });

      this.logger.log(paddleCustomerAccount);
      return paddleCustomerAccount;
    } catch (e) {
      this.logger.log(e);
      throw new InternalServerErrorException((e as Error).message);
    }
  }

  async activateCustomerAccount(customerId: string) {
    const paddleCustomerAccount = await this.paddle.customers.update(
      customerId,
      { status: 'active' },
    );

    this.logger.log(paddleCustomerAccount);
    return paddleCustomerAccount;
  }

  async activateBusinessAccount(customerId: string, businessId: string) {
    const paddleCustomerAccount = await this.paddle.businesses.update(
      customerId,
      businessId,
      { status: 'active' },
    );

    this.logger.log(paddleCustomerAccount);
    return paddleCustomerAccount;
  }
}
