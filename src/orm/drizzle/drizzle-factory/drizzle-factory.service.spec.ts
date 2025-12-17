import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleFactoryService } from './drizzle-factory.service';

describe('DrizzleFactoryService', () => {
  let service: DrizzleFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrizzleFactoryService],
    }).compile();

    service = module.get<DrizzleFactoryService>(DrizzleFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
