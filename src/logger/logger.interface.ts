export default interface ILoggerService {
  logAndReturn<T>(buffer: T, message?: string): T;
  log(message: any): void;
}
