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
import { EDatabaseStrategy } from '../../../types';
import AbstractDrizzlerService from '../abstract_drizzle.service';

export const TOKEN__DRIZZLE_FACTORY = 'DrizzleFactory';

export const DrizzleFactory = {
  provide: TOKEN__DRIZZLE_FACTORY,
  async useFactory(
    configService: ConfigService,
    moduleRef: ModuleRef,
  ): Promise<AbstractDrizzlerService> {
    const databaseStrategy = (
      configService.get('DATABASE_STRATEGY', EDatabaseStrategy.SQLITE) as string
    ).toLowerCase() as EDatabaseStrategy;

    switch (databaseStrategy) {
      case EDatabaseStrategy.POSTGRES: {
        return await moduleRef.create(DrizzlePostgresService);
      }
      case EDatabaseStrategy.SQLITE: {
        return await moduleRef.create(DrizzleSqliteService);
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

export type TDrizzleFactory = typeof DrizzleFactory;
