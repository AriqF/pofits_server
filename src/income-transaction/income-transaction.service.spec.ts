import { Test, TestingModule } from '@nestjs/testing';
import { IncomeTransactionService } from './income-transaction.service';

describe('IncomeTransactionService', () => {
  let service: IncomeTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncomeTransactionService],
    }).compile();

    service = module.get<IncomeTransactionService>(IncomeTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
