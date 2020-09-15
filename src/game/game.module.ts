import {Module, Global} from '@nestjs/common';
import { GameService } from './game.service';
import {GameInactiveService} from "./game-inactive.service";
import {ControlsModule} from "../controls/controls.module";
import {DemocracyModule} from "../democracy/democracy.module";
import {GoodiesModule} from "../goodies/goodies.module";
import {MovesModule} from "../moves/moves.module";
import {SnakeModule} from "../snake/snake.module";
import {StatsModule} from "../stats/stats.module";

@Global()
@Module({
  imports: [
    GoodiesModule,
    ControlsModule,
    DemocracyModule,
    MovesModule,
    SnakeModule,
    StatsModule
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
