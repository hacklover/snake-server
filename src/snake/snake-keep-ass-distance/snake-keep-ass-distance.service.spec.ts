import { Test, TestingModule } from '@nestjs/testing';
import { SnakeKeepAssDistanceService } from './snake-keep-ass-distance.service';

describe('SnakeAssDistanceService', () => {
  let service: SnakeKeepAssDistanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SnakeKeepAssDistanceService],
    }).compile();

    service = module.get<SnakeKeepAssDistanceService>(SnakeKeepAssDistanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
