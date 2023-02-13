import { Test, TestingModule } from '@nestjs/testing';
import { WeblogService } from './weblog.service';

describe('WeblogService', () => {
  let service: WeblogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeblogService],
    }).compile();

    service = module.get<WeblogService>(WeblogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
