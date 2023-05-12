import { Test, TestingModule } from '@nestjs/testing';
import { FinanceGoalController } from './finance-goal.controller';

describe('FinanceGoalController', () => {
  let controller: FinanceGoalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanceGoalController],
    }).compile();

    controller = module.get<FinanceGoalController>(FinanceGoalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
