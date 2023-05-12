import { Test, TestingModule } from '@nestjs/testing';
import { GoalTransactionHistoryController } from './goal-transaction-history.controller';

describe('GoalTransactionHistoryController', () => {
  let controller: GoalTransactionHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalTransactionHistoryController],
    }).compile();

    controller = module.get<GoalTransactionHistoryController>(GoalTransactionHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
