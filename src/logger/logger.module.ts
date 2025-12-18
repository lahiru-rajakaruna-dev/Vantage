import { Module } from '@nestjs/common';
import { ConsoleLoggerService } from './console_logger/console_logger.service';
import { WinstonLoggerService } from './winston_logger/winston_logger.service';
import { LoggerFactory } from './logger_factory/logger_factory.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ConsoleLoggerService, WinstonLoggerService, LoggerFactory],
  exports: [LoggerFactory],
})
export class LoggerModule {}
