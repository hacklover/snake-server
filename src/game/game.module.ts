import {Module, Global} from '@nestjs/common';
import { GameService } from './game.service';
import {GameInactiveService} from "./game-inactive.service";
import {GoodiesModule} from "../goodies/goodies.module";
import {StatsModule} from "../stats/stats.module";
import {MovesModule} from "../moves/moves.module";

@Global()
@Module({
  imports: [
    GoodiesModule,
    MovesModule,
    StatsModule,
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