import { Test, TestingModule } from '@nestjs/testing';
import { DemocracyController } from './democracy.controller';

describe('Democracy Controller', () => {
  let controller: DemocracyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemocracyController],
    }).compile();

    controller = module.get<DemocracyController>(DemocracyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
