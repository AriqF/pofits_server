import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseTransactionController } from './expense-transaction.controller';
import { ExpenseTransactionService } from './expense-transaction.service';

describe('ExpenseTransactionController', () => {
  let controller: ExpenseTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseTransactionController],
      providers: [ExpenseTransactionService],
    }).compile();

    controller = module.get<ExpenseTransactionController>(ExpenseTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
