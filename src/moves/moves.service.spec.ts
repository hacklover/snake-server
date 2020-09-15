import { Test, TestingModule } from '@nestjs/testing';
import { MovesService } from './moves.service';

describe('PoolService', () => {
  let service: MovesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovesService],
    }).compile();

    service = module.get<MovesService>(MovesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
