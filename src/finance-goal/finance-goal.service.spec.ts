import { Test, TestingModule } from '@nestjs/testing';
import { FinanceGoalService } from './finance-goal.service';

describe('FinanceGoalService', () => {
  let service: FinanceGoalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinanceGoalService],
    }).compile();

    service = module.get<FinanceGoalService>(FinanceGoalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
