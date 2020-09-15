import {Module, Global, forwardRef} from '@nestjs/common';
import { GameService } from './game.service';
import {GameInactiveService} from "./game-inactive.service";
import {ControlsModule} from "../controls/controls.module";
import {GoodiesModule} from "../goodies/goodies.module";
import {SnakeModule} from "../snake/snake.module";
import {StatsModule} from "../stats/stats.module";
import {MovesModule} from "../moves/moves.module";

@Global()
@Module({
  imports: [
    forwardRef(() => GoodiesModule),
    forwardRef(() => ControlsModule),
    forwardRef(() => MovesModule),
    forwardRef(() => SnakeModule),
    forwardRef(() => StatsModule),
  ],
  providers: [GameService,GameInactiveService],
  exports: [GameService,GameInactiveService]
})

export class GameModule {
  constructor(
    private readonly gameService: GameService
  ) {
    // save game every X seconds
    setInterval(() => this.gameService.saveGame(), Number(process.env.GAME_AUTOSAVE_INTERVAL));
  }
}
