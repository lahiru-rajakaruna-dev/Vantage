import { ConfigService } from '@nestjs/config';
import { ConsoleLoggerService } from './console-logger.service';
import { Inject } from '@nestjs/common';
import ILoggerService from './logger.interface';

export default class LoggerFactoryService {
  private readonly configService: ConfigService;
  private readonly consoleLogger: ConsoleLoggerService;

  constructor(
    @Inject() configService: ConfigService,
    @Inject() consoleLogger: ConsoleLoggerService,
  ) {
    this.configService = configService;
    this.consoleLogger = consoleLogger;
  }

  getLogger(): ILoggerService {
    switch (this.configService.get('NODE_ENV')) {
      case 'DEVELOPMENT':
        return this.consoleLogger;
      default:
        return this.consoleLogger;
    }
  }
}
