import { Test, TestingModule } from '@nestjs/testing';
import { OrmFactoryService } from './orm-factory.service';

describe('OrmFactoryService', () => {
  let service: OrmFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrmFactoryService],
    }).compile();

    service = module.get<OrmFactoryService>(OrmFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
