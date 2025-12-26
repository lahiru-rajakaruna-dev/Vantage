import { Test, TestingModule } from '@nestjs/testing';
import { PaddleService } from './paddle.service';

describe('PaddleService', () => {
  let service: PaddleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaddleService],
    }).compile();

    service = module.get<PaddleService>(PaddleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
