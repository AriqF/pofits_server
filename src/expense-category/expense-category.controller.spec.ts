import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseCategoryController } from './expense-category.controller';

describe('ExpenseCategoryController', () => {
  let controller: ExpenseCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseCategoryController],
    }).compile();

    controller = module.get<ExpenseCategoryController>(ExpenseCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
