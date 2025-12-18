import { Test, TestingModule } from '@nestjs/testing';
import { SalesGroupService } from './sales_group.service';

describe('SalesGroupService', () => {
  let service: SalesGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesGroupService],
    }).compile();

    service = module.get<SalesGroupService>(SalesGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
