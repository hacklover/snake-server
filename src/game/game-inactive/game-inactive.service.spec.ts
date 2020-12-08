import { Test, TestingModule } from '@nestjs/testing';
import { GameInactiveService } from './game-inactive.service';

describe('GameInactiveService', () => {
  let service: GameInactiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameInactiveService],
    }).compile();

    service = module.get<GameInactiveService>(GameInactiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
