import { EOrmStrategy, ORM_STRATEGY } from './../../types';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { InternalServerErrorException } from '@nestjs/common';
import IOrmInterface from '../orm.interface';
import { TOKEN__DRIZZLE_FACTORY } from '../drizzle/drizzle-factory/drizzle-factory.service';

export const TOKEN__ORM_FACTORY = 'OrmFactory';

export const OrmFactory = {
  provide: TOKEN__ORM_FACTORY,
  useFactory(
    configService: ConfigService,
    moduleRef: ModuleRef,
  ): IOrmInterface {
    const ormStrategy = (
      configService.get(ORM_STRATEGY, 'drizzle') as string
    ).toLowerCase() as EOrmStrategy;

    switch (ormStrategy) {
      case EOrmStrategy.DRIZZLE.toLowerCase(): {
        return moduleRef.get(TOKEN__DRIZZLE_FACTORY, { strict: false });
      }
      default: {
        throw new InternalServerErrorException(
          `[-] Invalid orm strategy. Available options: ${JSON.stringify(EOrmStrategy, null, 4)}`,
        );
      }
    }
  },
  inject: [ConfigService, ModuleRef],
};
