import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ILoggerService from './logger.interface';

@Injectable()
export class ConsoleLoggerService implements ILoggerService {
  private readonly logger: typeof console;

  constructor(@Inject() configService: ConfigService) {
    this.logger = console;
  }

  logAndReturn(
    buffer: any,
    message: string = '',
    logLevel: 'log' | 'debug' | 'warn' | 'error' | 'info' = 'info',
  ) {
    this.logger[logLevel](message?.trim(), buffer);
    return buffer;
  }
}
