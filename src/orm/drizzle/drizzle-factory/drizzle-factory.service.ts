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
import LoggerFactoryService from '../../../logger/logger-factory.service';
import { DrizzleSqliteService } from '../drizzle-sqlite/drizzle-sqlite.service';
import { InternalServerErrorException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import IOrmInterface from '../../orm.interface';

export const TOKEN__DRIZZLE_FACTORY = 'DrizzleFactory';
export const DrizzleFactory = {
  provide: TOKEN__DRIZZLE_FACTORY,
  useFactory(
    configService: ConfigService,
    moduleRef: ModuleRef,
  ): IOrmInterface {
    const databaseStrategy = configService.get('DATABASE_STRATEGY');

    switch (databaseStrategy) {
      case 'postgres': {
        return moduleRef.get(DrizzlePostgresService, { strict: true });
      }
      case 'sqlite': {
        return moduleRef.get(DrizzleSqliteService, { strict: true });
      }
      default: {
        throw new InternalServerErrorException(
          '[-] Invalid database strategy...',
        );
      }
    }
  },
  inject: [ConfigService, ModuleRef, LoggerFactoryService],
};
