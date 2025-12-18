import { Injectable } from '@nestjs/common';
import { AbstractLoggerService } from '../abstract_logger/abstract_logger.service';
import * as winston from 'winston';
import path from 'node:path';

@Injectable()
export class WinstonLoggerService extends AbstractLoggerService {
  constructor() {
    const winstonLogger = winston.createLogger({
      format: winston.format.colorize({
        level: true,
      }),
      level: 'info',
      transports: [
        new winston.transports.File({
          format: winston.format.json(),
          filename: 'logs.log',
          dirname: path.resolve(__dirname),
        }),
        new winston.transports.Console({
          format: winston.format.colorize({ level: true }),
        }),
      ],
    });
    super(winstonLogger);
  }
}
