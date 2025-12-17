import { Module } from '@nestjs/common';
import { ConsoleLoggerService } from './console-logger.service';
import LoggerFactoryService from './logger-factory.service';

@Module({
  providers: [LoggerFactoryService, ConsoleLoggerService],
  exports: [LoggerFactoryService],
})
export class LoggerModule {}
