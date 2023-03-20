import { Test, TestingModule } from '@nestjs/testing';
import { IncomeTransactionController } from './income-transaction.controller';
import { IncomeTransactionService } from './income-transaction.service';

describe('IncomeTransactionController', () => {
  let controller: IncomeTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomeTransactionController],
      providers: [IncomeTransactionService],
    }).compile();

    controller = module.get<IncomeTransactionController>(IncomeTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
