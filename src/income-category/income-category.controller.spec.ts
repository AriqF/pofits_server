import { Test, TestingModule } from '@nestjs/testing';
import { IncomeCategoryController } from './income-category.controller';

describe('IncomeCategoryController', () => {
  let controller: IncomeCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomeCategoryController],
    }).compile();

    controller = module.get<IncomeCategoryController>(IncomeCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
