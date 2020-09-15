import { Injectable } from '@nestjs/common';

import { Goodie, Snake } from '../interfaces/common.interface';
import { GoodiesService } from '../goodies/goodies.service';
import { ControlsService } from '../controls/controls.service';
import { DemocracyService } from '../democracy/democracy.service';
import { StatsService } from '../stats/stats.service';
import { UtilsService } from '../utils/utils.service';
import { GatewayService } from '../gateway/gateway.service';
import {GameInactiveService} from '../game/game-inactive.service';
import {StatsLastActionService} from "../stats/statsLastAction.service";

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
    private readonly democracyService: DemocracyService,
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
    const democracyLevel = this.democracyService.getDemocracyLevel();
    const lastActions = this.statsLastActionService.getLastActions();

    return { snake, goodies, stats, democracyLevel, lastActions };
  }

  /**
   * Get snake mode
   */
  getMode() {
    return this.snake.mode;
  }

  /**
   * Set snake mode
   *
   * @param mode
   */
  setMode(mode: string) {
    this.snake.mode = mode;
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
   * Get snake speed
   */
  getSnakeSpeed() {
    return this.snake.speed
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
   * Is snake damaged?
   */
  public isDamaged() {
    return this.snake.damaged
  }

  /**
   * Set snake damaged
   *
   * @param toggle
   */
  public setDamaged(toggle) {
    this.snake.damaged = toggle;
  }

  /**
   * Check collision
   *
   * @param item
   */
  private hasCollision(item) {
    const head = this.snake.body[this.getLength() - 1];

    return head[0] === item[0] && head[1] === item[1];
  }

  /**
   * Process collision
   */
  private processCollision() {
    const goodies = this.goodiesService.getGoodies();

    // bonus collision
    let i = 0;

    goodies.forEach((goodie: Goodie) => {
      if (this.hasCollision(goodie.pos)) {
        const goodieScore = GoodiesService.getGoodieScore(goodie);

        this.statsService.incrementScore(goodieScore);
        this.statsService.incrementGoodie();

        GatewayService.emit('snake-bonus-eaten', {
          type: goodie.type,
          score: goodieScore,
        });

        switch (goodie.type) {
          case 0:
            if (UtilsService.randomNumber(0, 4) === 4) {
              this.goodiesService.addRandomGoodie();
            } else {
              if (UtilsService.randomNumber(0, 3) === 3) {
                this.goodiesService.addGoodie();
              }

              if (UtilsService.randomNumber(0, 7) === 7) {
                this.goodiesService.addGoodie();
              }

              if (UtilsService.randomNumber(0, 15) === 15) {
                this.goodiesService.addGoodie();
                this.goodiesService.addGoodie();
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
                this.goodiesService.addRandomGoodie();
              }
            }

            if (UtilsService.randomNumber(0, 2) === 2) {
              this.goodiesService.addGoodie();
            }

            if (UtilsService.randomNumber(0, 4) === 4) {
              this.goodiesService.addGoodie();
            }

            if (UtilsService.randomNumber(0, 5) === 5) {
              this.goodiesService.addGoodie();
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
            }, 10000);
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
          this.goodiesService.addGoodie();

          if (UtilsService.randomNumber(0, 5) === 3) {
            this.goodiesService.addRandomGoodie();
          }
        }

        // snake++
        this.addLength();

        // remove taken bonus
        goodies.splice(i, 1);

        // no bonus fallback
        const goodiesListCount = Object.keys(goodies).length;
        if (goodiesListCount === 0) {
          this.goodiesService.addGoodie();
        }
      }

      i++;
    });

    // self collision
    for (const k in this.snake.body) {
      if (Number(k) !== this.snake.body.length - 1) {
        if (this.hasCollision(this.snake.body[k])) {
          this.removeLength();
          this.snake.damaged = true;
        }
      }
    }
  }

  inactivityCheck() {
    // after X minutes without a move, it adds 1 bonus
    if (this.controlsInactivityService.isInactiveMoreThanMinutes(360)) {
      if (this.goodiesService.getGoodiesCount() < 3) {
        this.goodiesService.addGoodie(0);
        this.controlsInactivityService.resetSecondsSinceLastMove();
      }
    }

    // after X minutes without a move, it removes 1 length
    if (this.controlsInactivityService.isInactiveMoreThanMinutes(360)) {
      if (this.getLength() > 4) {
        this.removeLength();
        this.controlsInactivityService.resetSecondsSinceLastMove();
      }
    }
  }

  /**
   * Set snake speed based on its length
   * (danger: embarrassing code; I'm not a mathematician)
   */
  private recalculateSpeed() {
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
  private addLength() {
    const snakeTail = this.snake.body[0];
    this.snake.body.unshift([snakeTail[0], snakeTail[1]]);
  }

  /**
   * Decrement snake length
   *
   * @param count
   */
  removeLength(count: number = 1) {
    for (let i = 0; i < count; i++) {
      this.snake.body.pop();
    }

    // for design purpose
    if (this.getLength() === 20) {
      this.snake.body.pop();
    }
  }

  /**
   * Return snake length
   */
  getLength() {
    return this.snake.body.length;
  }

  public nextMove() {
    if (this.getMode() !== 'lazy') {
      this.doStep();
    }

    this.processCollision();

    // calc new speed
    this.recalculateSpeed();

    // send updates
    GatewayService.emit('snake-update', this.getGame());

    this.statsLastActionService.resetLastActions();
  }

  /**
   * Do step ahead
   */
  private doStep() {
    const length = this.getLength() - 1;

    for (let i = 0; i < length; i++) {
      this.moveBlock(i);
    }

    this.moveHead();

    // reset damage status at next move
    if (this.isDamaged() === true) {
      this.setDamaged(false);
    }
  }

  /**
   * Move snake block (do step)
   *
   * @param i
   */
  private moveBlock(i) {
    this.snake.body[i][0] = this.snake.body[i + 1][0];
    this.snake.body[i][1] = this.snake.body[i + 1][1];
  }

  /**
   * Move snake head
   */
  private moveHead() {
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
   * Reset snake
   */
  reset() {
    this.snake.body = [];

    // put in place snake elements
    const rand = Math.floor(Math.random() * snakeStage.height);

    for (let i = Number(process.env.SNAKE_MIN_LENGTH); i > 0; i--) {
      this.snake.body.push([-i, rand]);
    }
  }
}
