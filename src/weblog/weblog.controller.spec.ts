import { Test, TestingModule } from '@nestjs/testing';
import { WeblogController } from './weblog.controller';

describe('WeblogController', () => {
  let controller: WeblogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeblogController],
    }).compile();

    controller = module.get<WeblogController>(WeblogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
