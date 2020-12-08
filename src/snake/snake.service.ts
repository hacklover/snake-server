import { Injectable } from '@nestjs/common';

import { Goody, Snake } from '../interfaces/common.interface';
import { GoodiesService } from '../goodies/goodies.service';
import { ControlsService } from '../controls/controls.service';
import { StatsService } from '../stats/stats.service';
import { UtilsService } from '../utils/utils.service';
import { GatewayService } from '../gateway/gateway.service';
import {GameInactiveService} from '../game/game-inactive/game-inactive.service';
import {StatsLastActionService} from "../stats/stats-last-action.service";

const snakeStage = {
  width: Number(process.env.SNAKE_STAGE_WIDTH),
  height: Number(process.env.SNAKE_STAGE_HEIGHT),
};

@Injectable()
export class SnakeService {
  private snake: Snake;

  private previousMode: string;
  private intervalLazyMode: any;

  constructor(
    private readonly goodiesService: GoodiesService,
    private readonly controlsService: ControlsService,
    private readonly controlsInactivityService: GameInactiveService,
    private readonly statsService: StatsService,
    private readonly statsLastActionService: StatsLastActionService,
  ) {}

  /**
   * Get game state
   */
  public getGame() {
    const snake = this.getSnake();
    const goodies = this.goodiesService.getGoodies();
    const stats = this.statsService.getStats();
    const lastActions = this.statsLastActionService.getLastActions();

    return { snake, goodies, stats, lastActions };
  }

  /**
   * Get snake status
   */
  getSnake() {
    // update direction in this.snake
    this.snake.direction = this.controlsService.getDirection();

    return this.snake;
  }

  /**
   * Set snake status
   *
   * @param snake
   */
  setSnake(snake: Snake) {
    this.snake = snake;
  }

  /**
   * Get snake mode
   */
  getSnakeMode() {
    return this.snake.mode;
  }

  /**
   * Set snake mode
   *
   * @param mode
   */
  setSnakeMode(mode: string) {
    this.snake.mode = mode;
  }

  /**
   * Get snake speed
   */
  getSnakeSpeed() {
    return this.snake.speed
  }

  /**
   * Get snake length
   */
  getSnakeLength() {
    return this.snake.body.length;
  }

  /**
   * Is snake damaged?
   */
  public isSnakeDamaged() {
    return this.snake.damaged
  }

  /**
   * Set snake damaged
   *
   * @param toggle
   */
  public setSnakeDamaged(toggle) {
    this.snake.damaged = toggle;
  }

  /**
   * Check collision
   *
   * @param item
   */
  private hasSnakeCollision(item) {
    const head = this.snake.body[this.getSnakeLength() - 1];

    return head[0] === item[0] && head[1] === item[1];
  }

  /**
   * Process collision
   */
  private processSnakeCollision() {
    const goodies = this.goodiesService.getGoodies();

    // bonus collision
    let i = 0;

    goodies.forEach((goody: Goody) => {
      if (this.hasSnakeCollision(goody.pos)) {
        const goodieScore = GoodiesService.getGoodyScore(goody);

        this.statsService.incrementScore(goodieScore);
        this.statsService.incrementGoodie();

        GatewayService.emit('snake-bonus-eaten', {
          type: goody.type,
          score: goodieScore,
        });

        switch (goody.type) {
          case 0:
            if (UtilsService.randomNumber(0, 4) === 4) {
              this.goodiesService.addRandomGoody();
            } else {
              if (UtilsService.randomNumber(0, 3) === 3) {
                this.goodiesService.addGoody();
              }

              if (UtilsService.randomNumber(0, 7) === 7) {
                this.goodiesService.addGoody();
              }

              if (UtilsService.randomNumber(0, 15) === 15) {
                this.goodiesService.addGoody();
                this.goodiesService.addGoody();
              }
            }
            break;

          // special
          case 1:
            // 33% drop
            if (UtilsService.randomNumber(0, 3) === 3) {
              // drop it
              const randomGoodieDrop = UtilsService.randomNumber(1, 3);

              for (let bd = 0; bd < randomGoodieDrop; bd++) {
                this.goodiesService.addRandomGoody();
              }
            }

            if (UtilsService.randomNumber(0, 2) === 2) {
              this.goodiesService.addGoody();
            }

            if (UtilsService.randomNumber(0, 4) === 4) {
              this.goodiesService.addGoody();
            }

            if (UtilsService.randomNumber(0, 5) === 5) {
              this.goodiesService.addGoody();
            }

            break;

          // lazy mode
          case 2:
            // sets previous mode
            if (this.snake.mode !== 'lazy') {
              this.previousMode = this.snake.mode;
            }
            if (!this.previousMode) {
              this.previousMode = 'default';
            }

            this.snake.mode = 'lazy';

            // clear previous lazy mode
            if (this.intervalLazyMode !== null) {
              clearInterval(this.intervalLazyMode);
            }

            // restore previous mode
            this.intervalLazyMode = setTimeout(() => {
              this.snake.mode = this.previousMode;
            }, 4000);
            break;

          /*
          // switch between classic and auto mode
          case 3:
            if (snake.mode === 'rush' || snake.mode === 'lazy') {
              snake.mode = 'default';
            } else {
              snake.mode = 'rush';
            }
            break;
          */

          // random direction
          case 4:
            const randomDirection = this.controlsService.getRandomDirection();

            this.controlsService.setDirection(randomDirection);

            this.statsLastActionService.addToLastActions({
              username: 'Goodie',
              direction: randomDirection,
            });
            break;

          // invisible
          case 5:
            break;
        }

        // drop 2 random bonus if...
        if (UtilsService.randomNumber(0, 5) === 5) {
          this.goodiesService.addGoody();

          if (UtilsService.randomNumber(0, 5) === 3) {
            this.goodiesService.addRandomGoody();
          }
        }

        // snake++
        this.addSnakeLength();

        // remove taken bonus
        goodies.splice(i, 1);

        // no bonus fallback
        const goodiesListCount = Object.keys(goodies).length;
        if (goodiesListCount === 0) {
          this.goodiesService.addGoody();
        }
      }

      i++;
    });

    // self collision
    for (const k in this.snake.body) {
      if (Number(k) !== this.snake.body.length - 1) {
        if (this.hasSnakeCollision(this.snake.body[k])) {
          this.removeSnakeLength();
          this.snake.damaged = true;
        }
      }
    }
  }

  /**
   * Set snake speed based on its length
   * [danger] embarrassing code, i'm not a mathematician
   */
  private recalculateSnakeSpeed() {
    this.snake.speed = 500;

    if (this.snake.mode !== 'lazy') {
      if (this.snake.body.length <= 7) {
        this.snake.speed = 3000;

      } else if (this.snake.body.length < 12) {
        this.snake.speed = 2750;

      } else if (this.snake.body.length < 16) {
        this.snake.speed = 2500;

      } else if (this.snake.body.length < 20) {
        this.snake.speed = 2250;

      } else if (this.snake.body.length < 24) {
        this.snake.speed = 2000;

      } else if (this.snake.body.length < 28) {
        this.snake.speed = 1800;

      } else if (this.snake.body.length < 32) {
        this.snake.speed = 1600;

      } else if (this.snake.body.length < 36) {
        this.snake.speed = 1400;

      } else if (this.snake.body.length < 40) {
        this.snake.speed = 1200;

      } else if (this.snake.body.length < 45) {
        this.snake.speed = 1000;

      } else if (this.snake.body.length < 50) {
        this.snake.speed = 900;

      } else if (this.snake.body.length < 60) {
        this.snake.speed = 800;

      } else if (this.snake.body.length < 70) {
        this.snake.speed = 700;

      } else if (this.snake.body.length < 80) {
        this.snake.speed = 600;

      } else {
        this.snake.speed = 500;
      }
    }

    return this.snake.speed;
  }

  /**
   * Increment snake length
   */
  private addSnakeLength() {
    const snakeTail = this.snake.body[0];
    this.snake.body.unshift([snakeTail[0], snakeTail[1]]);
  }

  /**
   * Decrement snake length
   *
   * @param count
   */
  removeSnakeLength(count: number = 1) {
    for (let i = 0; i < count; i++) {
      this.snake.body.pop();
    }

    // for design purpose
    if (this.getSnakeLength() === 20) {
      this.snake.body.pop();
    }
  }

  public nextMove() {
    if (this.getSnakeMode() !== 'lazy') {
      this.doSnakeStep();
    }

    this.processSnakeCollision();

    // calc new speed
    this.recalculateSnakeSpeed();

    // send updates
    GatewayService.emit('snake-update', this.getGame());

    this.statsLastActionService.resetSnakeLastActions();
  }

  /**
   * Do step ahead
   */
  private doSnakeStep() {
    const length = this.getSnakeLength() - 1;

    for (let i = 0; i < length; i++) {
      this.moveSnakeBlock(i);
    }

    this.moveSnakeHead();

    // resetSnake damage status at next move
    if (this.isSnakeDamaged() === true) {
      this.setSnakeDamaged(false);
    }
  }

  /**
   * Move snake block (do step)
   *
   * @param i
   */
  private moveSnakeBlock(i) {
    this.snake.body[i][0] = this.snake.body[i + 1][0];
    this.snake.body[i][1] = this.snake.body[i + 1][1];
  }

  /**
   * Move snake head
   */
  private moveSnakeHead() {
    const currentDirection = this.controlsService.getDirection();

    const length = this.snake.body.length;
    const head: any = this.snake.body[length - 1];

    // moving the pos of the head according to the directions
    switch (currentDirection) {
      case 'left':
        head[0]--;
        break;

      case 'right':
        head[0]++;
        break;

      case 'down':
        head[1]++;
        break;

      case 'up':
        head[1]--;
        break;
    }

    if (head[0] > Number(process.env.SNAKE_STAGE_WIDTH)) {
      head[0] = 0;
    } else if (head[0] < 0) {
      head[0] = Number(process.env.SNAKE_STAGE_WIDTH);
    }

    if (head[1] > Number(process.env.SNAKE_STAGE_HEIGHT)) {
      head[1] = 0;
    } else if (head[1] < 0) {
      head[1] = Number(process.env.SNAKE_STAGE_HEIGHT);
    }
  }

  /**
   * resetSnake snake
   */
  resetSnake() {
    this.snake.body = [];

    // put in place snake elements
    const rand = Math.floor(Math.random() * snakeStage.height);

    for (let i = Number(process.env.SNAKE_MIN_LENGTH); i > 0; i--) {
      this.snake.body.push([-i, rand]);
    }
  }
}
