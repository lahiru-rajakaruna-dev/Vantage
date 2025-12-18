import { Test, TestingModule } from '@nestjs/testing';
import { SalesGroupController } from './sales_group.controller';

describe('SalesGroupController', () => {
  let controller: SalesGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesGroupController],
    }).compile();

    controller = module.get<SalesGroupController>(SalesGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
