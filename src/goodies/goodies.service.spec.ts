import { Test, TestingModule } from '@nestjs/testing';
import { GoodiesService } from './goodies.service';

describe('GoodiesService', () => {
  let service: GoodiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodiesService],
    }).compile();

    service = module.get<GoodiesService>(GoodiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
