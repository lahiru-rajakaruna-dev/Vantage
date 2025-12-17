import { ORM_STRATEGY } from './../../types';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { InternalServerErrorException } from '@nestjs/common';
import IOrmInterface from '../orm.interface';

export const TOKEN__ORM_FACTORY = 'OrmFactory';

export const OrmFactory = {
  provide: TOKEN__ORM_FACTORY,
  useFactory(
    configService: ConfigService,
    moduleRef: ModuleRef,
  ): IOrmInterface {
    const ormStrategy = configService.get(ORM_STRATEGY) as string;

    switch (ormStrategy) {
      case 'drizzle': {
        return moduleRef.get('DrizzleFactory', { strict: true });
      }
      case 'prisma': {
        return moduleRef.get('PrismaFactory', { strict: true });
      }
      default: {
        throw new InternalServerErrorException('[-] Invalid orm strategy...');
      }
    }
  },
  inject: [ConfigService, ModuleRef],
};
