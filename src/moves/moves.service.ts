import {Global, Injectable} from '@nestjs/common';
import {SnakeService} from "../snake/snake.service";
import {ControlsService} from "../controls/controls.service";
import {StatsService} from "../stats/stats.service";
import {StatsLastActionService} from "../stats/stats-last-action.service";
import {PlayersService} from "../players/players.service";
import {MovesAutomaticService} from "./moves-automatic/moves-automatic.service";
import {SnakeKeepAssDistanceService} from "../snake/snake-keep-ass-distance/snake-keep-ass-distance.service";
import { SnakeMove } from '../interfaces/common.interface';

@Global()
@Injectable()
export class MovesService {
  private movesQueue: SnakeMove[] = [];
  private lastMoveSent: number = 0;

  constructor(
    private readonly snakeService: SnakeService,
    private readonly snakeAssDistanceService: SnakeKeepAssDistanceService,
    private readonly statsService: StatsService,
    private readonly statsLastActionService: StatsLastActionService,
    private readonly controlsService: ControlsService,
    private readonly playersService: PlayersService,
    private readonly movesAutomaticService: MovesAutomaticService
  ) {}

  /**
   * Add direction to moves queue
   *
   * @param username
   * @param ip
   * @param direction
   */
  addDirectionToMovesQueue(username: string, ip: string, direction: string) {
    // add move to generic queue
    this.movesQueue.push({ user: { username, ip }, direction });
    this.playersService.addPlayer(ip);
  }

  /**
   * Get count moves in queue
   */
  getCountMovesInQueue() {
    return this.movesQueue.length
  }

  /**
   * Get next move in queue
   */
  getNextMoveInQueue() {
    return this.movesQueue[0]
  }

  /**
   * resetSnake moves
   */
  resetSnakeMovesInQueue() {
    this.movesQueue = []
  }

  /**
   * Process next move in queue (determine timings and run it)
   */
  handleNextMoveInQueue() {
    if (this.getCountMovesInQueue() > 0) {
      if (((+ new Date()) - this.lastMoveSent) > Number(process.env.MOVES_QUEUE_NEXT_MOVE_TIMEOUT)) {
        // last move time sent is > 1000ms, process move immediately
        this.processNextMoveInQueue();
      } else {
        setTimeout(() => {
          // wait some time before process next move, then call this method again
          this.processNextMoveInQueue();
          this.handleNextMoveInQueue()
        }, Number(process.env.MOVES_QUEUE_NEXT_MOVE_TIMEOUT));
      }
    }
  }

  /**
   * Apply next move in queue
   */
  processNextMoveInQueue() {
    const nextMove = this.getNextMoveInQueue();

    if (this.controlsService.isOppositeDirection(nextMove.direction)) {
      // when damaged, can do opposite direction
      if (!this.snakeService.isSnakeDamaged()) {
        // delete move, not more needed
        this.movesQueue.shift();

        // skip move
        if (this.getCountMovesInQueue() > 0) {
          this.processNextMoveInQueue()
        }

        return false;
      }
    }

    this.statsService.incrementMove();
    this.statsLastActionService.addToLastActions(nextMove);
    this.controlsService.setDirection(nextMove.direction);

    this.movesAutomaticService.resetSnakeSnakeAutoMoveTimeout();

    // prevent face2ass after 120 sec
    this.snakeAssDistanceService.resetSnakeSnakeAssDistanceCheck()

    this.snakeService.nextMove();

    // delete move, not more needed
    this.movesQueue.shift();

    this.lastMoveSent = + new Date();
  }

  /**
   * Determine prevalent direction from pool moves
   */
  determinePrevalentDirection() {
    let countDirections: any = {
      up: 0,
      right: 0,
      down: 0,
      left: 0
    };

    if (this.movesQueue.length > 0) {
      this.movesQueue.forEach((poolDirection) => {
        countDirections[poolDirection.direction]++;
      })
    }

    // sort directions by prevalent
    countDirections = sortProperties(countDirections);

    // choose prevalent direction
    let maxValue = 0;
    let prevalentDirection = null;
    const prevalentDirections = [];

    Object.keys(countDirections).forEach(direction => {
      if (countDirections[direction] > maxValue) {
        maxValue = countDirections[direction];
      }
    });

    Object.keys(countDirections).forEach(direction => {
      if (countDirections[direction] === maxValue) {
        // check if direction isn't opposite of current position
        if (!this.controlsService.isOppositeDirection(direction)) {
          prevalentDirections.push(direction)
        }
      }
    });

    if (prevalentDirections.length === 1) {
      prevalentDirection = prevalentDirections[0];
    } else if (prevalentDirections.length > 1) {
      prevalentDirection = prevalentDirections[Math.floor(Math.random() * prevalentDirections.length)]
    }

    return {
      direction: prevalentDirection,
      votesPrevalentDirection: maxValue,
      votesTotal: this.getCountMovesInQueue()
    };

    // sort properties
    function sortProperties(obj) {
      // convert object into array
      const sortable = [];

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sortable.push([key, obj[key]]); // each item is an array in format [key, value]
        }
      }

      // sort items by value
      sortable.sort((a, b) => {
        return b[1] - a[1]; // compare numbers
      });

      // rebuild object
      const countDirectionsTmp = {};

      sortable.forEach((item) => {
        countDirectionsTmp[item[0]] = item[1];
      });

      return countDirectionsTmp;
    }
  }
}
