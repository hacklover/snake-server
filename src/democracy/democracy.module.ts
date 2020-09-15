import {Module, forwardRef} from '@nestjs/common';
import { DemocracyService } from './democracy.service';
import { DemocracyController } from './democracy.controller';
import {ControlsModule} from "../controls/controls.module";
import {StatsModule} from "../stats/stats.module";

@Module({
  imports: [
    forwardRef(() => ControlsModule),
    forwardRef(() => StatsModule)
  ],
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
