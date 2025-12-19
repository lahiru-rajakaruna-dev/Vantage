// import { Inject, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { DrizzlePostgresService } from '../drizzle-postgres/drizzle-postgres.service';
//
// @Injectable()
// export class DrizzleFactoryService {
//   private readonly configService: ConfigService;
//   private readonly drizzlePostgres: DrizzlePostgresService;
//
//   constructor(
//     @Inject() configService: ConfigService,
//     @Inject() drizzlePostgres: DrizzlePostgresService,
//   ) {
//     this.configService = configService;
//     this.drizzlePostgres = drizzlePostgres;
//   }
//
//   getOrm() {
//     switch (this.configService.get('DATABASE_SERVICE')) {
//       case 'POSTGRES':
//         return this.drizzlePostgres;
//       default:
//         return this.drizzlePostgres;
//     }
//   }
// }

import { ConfigService } from '@nestjs/config';
import { DrizzlePostgresService } from '../drizzle-postgres/drizzle-postgres.service';
import { DrizzleSqliteService } from '../drizzle-sqlite/drizzle-sqlite.service';
import { InternalServerErrorException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import IOrmInterface from '../../orm.interface';
import { EDatabaseStrategy } from '../../../types';

export const TOKEN__DRIZZLE_FACTORY = 'DrizzleFactory';

export const DrizzleFactory = {
  provide: TOKEN__DRIZZLE_FACTORY,
  useFactory(
    configService: ConfigService,
    moduleRef: ModuleRef,
  ): IOrmInterface {
    const databaseStrategy = (
      configService.get('DATABASE_STRATEGY', EDatabaseStrategy.SQLITE) as string
    ).toLowerCase() as EDatabaseStrategy;

    switch (databaseStrategy) {
      case EDatabaseStrategy.POSTGRES: {
        return moduleRef.get(DrizzlePostgresService, { strict: false });
      }
      case EDatabaseStrategy.SQLITE: {
        return moduleRef.get(DrizzleSqliteService, { strict: false });
      }
      default: {
        throw new InternalServerErrorException(
          `[-] Invalid database strategy. Available options ${JSON.stringify(EDatabaseStrategy)}`,
        );
      }
    }
  },
  inject: [ConfigService, ModuleRef],
};
