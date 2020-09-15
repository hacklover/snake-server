import { Test, TestingModule } from '@nestjs/testing';
import { DemocracyService } from './democracy.service';

describe('DemocracyService', () => {
  let service: DemocracyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemocracyService],
    }).compile();

    service = module.get<DemocracyService>(DemocracyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
