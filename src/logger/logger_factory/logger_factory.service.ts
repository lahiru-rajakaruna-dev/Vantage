import { InternalServerErrorException, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ILoggerService from '../logger.interface';
import { EEnvVars, ELoggerStrategy } from '../../types';
import { ModuleRef } from '@nestjs/core';
import { ConsoleLoggerService } from '../console_logger/console_logger.service';
import { WinstonLoggerService } from '../winston_logger/winston_logger.service';

export const TOKEN__LOGGER_FACTORY = 'LoggerFactory';

export const LoggerFactory: Provider = {
  provide: TOKEN__LOGGER_FACTORY,
  useFactory(
    configService: ConfigService,
    moduleRef: ModuleRef,
  ): ILoggerService {
    const loggerStrategy: ELoggerStrategy = configService.get(
      EEnvVars.LOGGER_STRATEGY,
    ) as ELoggerStrategy;

    switch (loggerStrategy) {
      case ELoggerStrategy.CONSOLE: {
        return moduleRef.get(ConsoleLoggerService, { strict: true });
      }
      case ELoggerStrategy.WINSTON: {
        return moduleRef.get(WinstonLoggerService, { strict: true });
      }
      // case ELoggerStrategy.CONSOLE:{
      //   return moduleRef.get(ConsoleLoggerService,{strict:true})
      // }
      default: {
        throw new InternalServerErrorException(
          '[-] Invalid logger strategy...',
        );
      }
    }
  },
  inject: [ConfigService, ModuleRef],
};
