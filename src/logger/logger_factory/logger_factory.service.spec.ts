import { Test, TestingModule } from '@nestjs/testing';
import { LoggerFactoryService } from './logger_factory.service';

describe('LoggerFactoryService', () => {
  let service: LoggerFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerFactoryService],
    }).compile();

    service = module.get<LoggerFactoryService>(LoggerFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
