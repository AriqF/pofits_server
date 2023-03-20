import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseTransactionService } from './expense-transaction.service';

describe('ExpenseTransactionService', () => {
  let service: ExpenseTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpenseTransactionService],
    }).compile();

    service = module.get<ExpenseTransactionService>(ExpenseTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
