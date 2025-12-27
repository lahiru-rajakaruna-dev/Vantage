import { EEnvVars, EOrmStrategy } from './../../types';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { TOKEN__DRIZZLE_FACTORY } from '../drizzle/drizzle-factory/drizzle-factory.service';
import AbstractDrizzlerService from '../drizzle/abstract_drizzle.service';

export const TOKEN__ORM_FACTORY = 'OrmFactory';

export const OrmFactory = {
  provide: TOKEN__ORM_FACTORY,
  useFactory(
    configService: ConfigService,
    drizzleService: AbstractDrizzlerService,
  ) {
    const ormStrategy = (
      configService.get(EEnvVars.ORM_STRATEGY) as string
    ).toUpperCase() as EOrmStrategy;

    switch (ormStrategy) {
      case EOrmStrategy.DRIZZLE.toLowerCase(): {
        return drizzleService;
      }

      default: {
        throw new InternalServerErrorException(
          `[-] Invalid orm strategy. Available options: ${JSON.stringify(EOrmStrategy, null, 4)}`,
        );
      }
    }
  },
  inject: [ConfigService, TOKEN__DRIZZLE_FACTORY],
};
