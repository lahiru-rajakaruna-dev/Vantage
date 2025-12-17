import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleSqliteService } from './drizzle-sqlite.service';

describe('DrizzleSqliteService', () => {
  let service: DrizzleSqliteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrizzleSqliteService],
    }).compile();

    service = module.get<DrizzleSqliteService>(DrizzleSqliteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
