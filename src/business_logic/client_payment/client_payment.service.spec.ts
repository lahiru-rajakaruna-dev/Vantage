import { Test, TestingModule } from '@nestjs/testing';
import { ClientPaymentService } from './client_payment.service';

describe('ClientPaymentService', () => {
  let service: ClientPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientPaymentService],
    }).compile();

    service = module.get<ClientPaymentService>(ClientPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
