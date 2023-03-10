import { Test, TestingModule } from '@nestjs/testing';
import { IncomeEstimationController } from './income-estimation.controller';
import { IncomeEstimationService } from './income-estimation.service';

describe('IncomeEstimationController', () => {
  let controller: IncomeEstimationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomeEstimationController],
      providers: [IncomeEstimationService],
    }).compile();

    controller = module.get<IncomeEstimationController>(IncomeEstimationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
