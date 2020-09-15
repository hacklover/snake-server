import { Injectable } from '@nestjs/common';
import {Game} from "../interfaces/common.interface";
import {StorageService} from "../storage/storage.service";
import {SnakeService} from "../snake/snake.service";
import {ControlsService} from "../controls/controls.service";
import {GoodiesService} from "../goodies/goodies.service";
import {DemocracyService} from "../democracy/democracy.service";
import {StatsService} from "../stats/stats.service";
import {MovesService} from "../moves/moves.service";
import {MovesAutomaticService} from "../moves/moves-automatic/moves-automatic.service";

@Injectable()
export class GameService {
  private game: Game;

  constructor(
    private readonly snakeService: SnakeService,
    private readonly controlsService: ControlsService,
    private readonly goodiesService: GoodiesService,
    private readonly democracyService: DemocracyService,
    private readonly movesService: MovesService,
    private readonly movesAutomaticService: MovesAutomaticService,
    private readonly statsService: StatsService,
  ) {

  }

  /**
   * Load previous game state
   */
  public loadGame() {
    // start new game / resume game
    this.game = StorageService.readGameSave();

    // load previous state
    this.snakeService.setSnake(this.game.snake);
    this.controlsService.setDirection(this.game.snake.direction);
    this.goodiesService.setGoodies(this.game.goodies);
    this.democracyService.setDemocracyLevel(this.game.democracyLevel);
    this.statsService.setStats(this.game.stats);

    // reset lazy mode
    if (this.snakeService.getMode() === 'lazy') {
      this.snakeService.setMode('default');
    }

    // if is a new game
    if (this.statsService.getStats().score === 0) {
      // add some goodies
      for (let i = 0; i < 3; i++) {
        this.goodiesService.addGoodie();
      }
    }

    // fix damage if snake starts damaged
    if (this.snakeService.isDamaged() === true) {
      this.snakeService.setDamaged(false);
    }

    // length = 0, reset
    if (this.snakeService.getLength() === 0) {
      this.snakeService.reset();
    }

    this.movesAutomaticService.resetAutomaticMove();
  }
  /**
   * Save current game state
   */
  public saveGame() {
    // refresh this.game status object
    this.game = this.snakeService.getGame();

    StorageService.writeGameSave(this.game);
  }

  /**
   * Default game state
   */
  static getNewGameDefaultState() {
    return {
      snake: {
        mode: 'default',
        direction: 'right',
        speed: 5000,
        body: [],
        damaged: false,
      },
      goodies: [],
      stats: {
        score: 0,
        goodies: 0,
        moves: 0
      },
      democracyLevel: 40
    }
  }
}
