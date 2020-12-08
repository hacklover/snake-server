import {Module, Global} from '@nestjs/common';
import { GameService } from './game.service';
import {GameInactiveService} from "./game-inactive/game-inactive.service";
import {GoodiesModule} from "../goodies/goodies.module";
import {StatsModule} from "../stats/stats.module";
import {MovesModule} from "../moves/moves.module";
import { SnakeService } from '../snake/snake.service';
import { GoodiesService } from '../goodies/goodies.service';

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
  private readonly autosaveInterval: number = 5000;

  constructor(
    private readonly gameService: GameService,
    private readonly gameInactiveService: GameInactiveService,
    private readonly snakeService: SnakeService,
    private readonly goodiesService: GoodiesService,
  ) {
    if (process.env.GAME_AUTOSAVE_INTERVAL) {
      this.autosaveInterval = Number(process.env.GAME_AUTOSAVE_INTERVAL)
    }

    // save game every X seconds
    setInterval(() => this.gameService.saveGame(), this.autosaveInterval);

    // increment seconds to track game inactivity
    setInterval(() => this.gameInactiveService.incrementSecondsSinceLastMove(), 1000);

    // do inactivity check
    setInterval(() => {
      // after X minutes without a move, it adds 1 bonus
      if (this.gameInactiveService.isInactiveMoreThanMinutes(360)) {
        if (this.goodiesService.getGoodiesCount() < 3) {
          this.goodiesService.addGoody(0);
          this.gameInactiveService.resetSnakeSecondsSinceLastMove();
        }
      }

      // after X minutes without a move, it removes 1 length
      if (this.gameInactiveService.isInactiveMoreThanMinutes(360)) {
        if (this.snakeService.getSnakeLength() > 4) {
          this.snakeService.removeSnakeLength();
          this.gameInactiveService.resetSnakeSecondsSinceLastMove();
        }
      }
    }, 10000);
  }
}