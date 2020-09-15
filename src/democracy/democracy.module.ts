import 'dotenv/config';
import { Module, Global } from '@nestjs/common';
import { DemocracyService } from './democracy.service';
import { DemocracyController } from './democracy.controller';

@Global()
@Module({
  controllers: [DemocracyController],
  providers: [DemocracyService],
  exports: [DemocracyService],
})
export class DemocracyModule {
  constructor(private readonly democracyService: DemocracyService) {
    // apply democracy votes every X seconds
    setInterval(
      () => this.democracyService.applyDemocracyVotes(),
      Number(process.env.DEMOCRACY_INTERVAL_APPLY_VOTES)
    )
  }
}
