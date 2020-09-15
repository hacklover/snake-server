import {Module} from '@nestjs/common';
import { SnakeService } from './snake.service';
import {ControlsModule} from "../controls/controls.module";
import {DemocracyModule} from "../democracy/democracy.module";
import {GoodiesModule} from "../goodies/goodies.module";
import {StatsModule} from "../stats/stats.module";

@Module({
  imports: [
    GoodiesModule,
    ControlsModule,
    DemocracyModule,
    StatsModule
  ],
  providers: [SnakeService],
  exports: [SnakeService],
})

export class SnakeModule {
  constructor(private readonly snakeService: SnakeService) {
    setInterval(() => this.snakeService.inactivityCheck(), 10000);
  }
}
