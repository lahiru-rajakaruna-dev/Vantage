import { Test, TestingModule } from '@nestjs/testing';
import { AbstractLoggerService } from './abstract_logger.service';

describe('AbstractLoggerService', () => {
  let service: AbstractLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbstractLoggerService],
    }).compile();

    service = module.get<AbstractLoggerService>(AbstractLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
