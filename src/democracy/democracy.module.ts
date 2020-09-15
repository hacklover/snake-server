import {Module, forwardRef} from '@nestjs/common';
import { DemocracyService } from './democracy.service';
import { DemocracyController } from './democracy.controller';
import {StatsModule} from "../stats/stats.module";
import {SnakeModule} from "../snake/snake.module";
import {MovesModule} from "../moves/moves.module";

@Module({
  imports: [
    forwardRef(() => StatsModule),
    forwardRef(() => SnakeModule),
    forwardRef(() => MovesModule),
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
