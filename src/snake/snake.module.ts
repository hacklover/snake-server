import {forwardRef, Global, Module} from '@nestjs/common';
import { SnakeService } from './snake.service';
import {ControlsModule} from "../controls/controls.module";
import {GoodiesModule} from "../goodies/goodies.module";
import {StatsModule} from "../stats/stats.module";
import { SnakeKeepAssDistanceService } from './snake-keep-ass-distance/snake-keep-ass-distance.service';

@Global()
@Module({
  imports: [
    forwardRef(() => GoodiesModule),
    forwardRef(() => ControlsModule),
    forwardRef(() => StatsModule),
  ],
  providers: [SnakeService, SnakeKeepAssDistanceService],
  exports: [SnakeService, SnakeKeepAssDistanceService],
})

export class SnakeModule {
  constructor(private readonly snakeService: SnakeService) {
    setInterval(() => this.snakeService.inactivityCheck(), 10000);
  }
}
