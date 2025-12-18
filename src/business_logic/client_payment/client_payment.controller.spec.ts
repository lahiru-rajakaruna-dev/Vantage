import { Test, TestingModule } from '@nestjs/testing';
import { ClientPaymentController } from './client_payment.controller';

describe('ClientPaymentController', () => {
  let controller: ClientPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientPaymentController],
    }).compile();

    controller = module.get<ClientPaymentController>(ClientPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
