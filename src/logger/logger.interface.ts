export default interface ILoggerService {
  logAndReturn<T>(buffer: T): T;
  log(message: any): void;
}
