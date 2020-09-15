import { Test, TestingModule } from '@nestjs/testing';
import { MovesAutomaticService } from './moves-automatic.service';

describe('MovesAutomaticService', () => {
  let service: MovesAutomaticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovesAutomaticService],
    }).compile();

    service = module.get<MovesAutomaticService>(MovesAutomaticService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
