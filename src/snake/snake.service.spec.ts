import { Test, TestingModule } from '@nestjs/testing';
import { SnakeService } from './snake.service';

describe('SnakeService', () => {
  let service: SnakeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SnakeService],
    }).compile();

    service = module.get<SnakeService>(SnakeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
