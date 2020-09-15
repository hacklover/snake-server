import {forwardRef, Module} from '@nestjs/common';
import { MovesService } from './moves.service';
import {ControlsModule} from "../controls/controls.module";
import {DemocracyModule} from "../democracy/democracy.module";
import {SnakeModule} from "../snake/snake.module";
import {StatsModule} from "../stats/stats.module";

@Module({
  imports:[
    forwardRef(() => ControlsModule),
    forwardRef(() => DemocracyModule),
    forwardRef(() => SnakeModule),
    forwardRef(() => StatsModule),
  ],
  providers: [MovesService],
  exports: [MovesService]
})
export class MovesModule {}
