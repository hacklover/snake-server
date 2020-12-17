import { Injectable } from '@nestjs/common';
import { GameService } from './game/game.service';
import { GameInactiveService } from './game/game-inactive/game-inactive.service';
import { SnakeService } from './snake/snake.service';
import { GoodiesService } from './goodies/goodies.service';

@Injectable()
export class AppService {
  constructor(
    private readonly gameService: GameService,
    private readonly gameInactiveService: GameInactiveService,
    private readonly snakeService: SnakeService,
    private readonly goodiesService: GoodiesService,
  ) {}

  /**
   * Boot game when app is ready
   */
  onApplicationBootstrap() {
    // start game
    const game = this.gameService.loadGame();

    if (game) {
      // save game every X seconds
      setInterval(() => this.gameService.saveGame(), GameService.gameAutosaveInterval);

      // increase seconds to track game inactivity
      setInterval(() => this.gameInactiveService.incrementSecondsSinceLastMove(), 1000);

      // run inactivity check
      setInterval(() => {
        // after X minutes without a move, add 1 bonus
        if (this.gameInactiveService.isInactiveMoreThanMinutes(360)) {
          if (this.goodiesService.getGoodiesCount() < 3) {
            this.goodiesService.addGoody(0);
            this.gameInactiveService.resetSnakeSecondsSinceLastMove();
          }
        }

        // after X minutes without any move, remove 1 block from snake length
        if (this.gameInactiveService.isInactiveMoreThanMinutes(360)) {
          if (this.snakeService.getSnakeLength() > 4) {
            this.snakeService.removeSnakeLength();
            this.gameInactiveService.resetSnakeSecondsSinceLastMove();
          }
        }
      }, 10000);
    }
  }
}
