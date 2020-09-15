import {forwardRef, Module} from '@nestjs/common';
import { MovesService } from './moves.service';
import {ControlsModule} from "../controls/controls.module";
import {SnakeModule} from "../snake/snake.module";
import {StatsModule} from "../stats/stats.module";
import {PlayersModule} from "../players/players.module";
import { MovesAutomaticService } from './moves-automatic/moves-automatic.service';

@Module({
  imports:[
    forwardRef(() => ControlsModule),
    forwardRef(() => SnakeModule),
    forwardRef(() => StatsModule),
    forwardRef(() => PlayersModule),
  ],
  providers: [MovesService, MovesAutomaticService],
  exports: [MovesService,MovesAutomaticService]
})
export class MovesModule {}
