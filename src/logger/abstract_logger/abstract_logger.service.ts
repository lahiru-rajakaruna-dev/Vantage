import ILoggerService from '../logger.interface';
import { type ILogTransporter } from '../log_transporter.interface';

export abstract class AbstractLoggerService implements ILoggerService {
  private logTransporter: ILogTransporter;

  constructor(logTransporter: ILogTransporter) {
    this.logTransporter = logTransporter;
  }

  log(message: any) {
    this.logTransporter.log(message);
  }

  logAndReturn<T>(buffer: T): T {
    this.logTransporter.log(buffer);

    return buffer;
  }
}
