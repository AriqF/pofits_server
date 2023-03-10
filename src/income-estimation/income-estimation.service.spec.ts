import { Test, TestingModule } from '@nestjs/testing';
import { IncomeEstimationService } from './income-estimation.service';

describe('IncomeEstimationService', () => {
  let service: IncomeEstimationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncomeEstimationService],
    }).compile();

    service = module.get<IncomeEstimationService>(IncomeEstimationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
