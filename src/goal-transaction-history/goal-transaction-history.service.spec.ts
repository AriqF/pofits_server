import { Test, TestingModule } from '@nestjs/testing';
import { GoalTransactionHistoryService } from './goal-transaction-history.service';

describe('GoalTransactionHistoryService', () => {
  let service: GoalTransactionHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoalTransactionHistoryService],
    }).compile();

    service = module.get<GoalTransactionHistoryService>(GoalTransactionHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
