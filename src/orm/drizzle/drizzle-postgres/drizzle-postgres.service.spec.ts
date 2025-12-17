import { Test, TestingModule } from '@nestjs/testing';
import { DrizzlePostgresService } from './drizzle-postgres.service';

describe('DrizzlePostgresService', () => {
  let service: DrizzlePostgresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrizzlePostgresService],
    }).compile();

    service = module.get<DrizzlePostgresService>(DrizzlePostgresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
