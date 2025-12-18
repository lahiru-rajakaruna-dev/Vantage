import { Injectable } from '@nestjs/common';
import { AbstractLoggerService } from '../abstract_logger/abstract_logger.service';

@Injectable()
export class ConsoleLoggerService extends AbstractLoggerService {
  constructor() {
    super(console);
  }
}
