import { Test, TestingModule } from '@nestjs/testing';
import { IncomeCategoryService } from './income-category.service';

describe('IncomeCategoryService', () => {
  let service: IncomeCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncomeCategoryService],
    }).compile();

    service = module.get<IncomeCategoryService>(IncomeCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
