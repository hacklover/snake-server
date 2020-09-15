import { Injectable } from '@nestjs/common';
import {SnakeService} from "../snake/snake.service";
import {ControlsService} from "../controls/controls.service";
import {StatsService} from "../stats/stats.service";
import {DemocracyService} from "../democracy/democracy.service";
import {StatsLastActionService} from "../stats/statsLastAction.service";

@Injectable()
export class MovesService {
  private movesQueue: any[] = [];
  private players: any[] = [];

  private lastMoveSent: number = 0;

  private timeoutAutomaticMove: any;
  private timeoutCheckSnakeAssDistance: any;

  constructor(
    private readonly snakeService: SnakeService,
    private readonly statsService: StatsService,
    private readonly statsLastActionService: StatsLastActionService,
    private readonly democracyService: DemocracyService,
    private readonly controlsService: ControlsService
  ) {}

  /**
   * Reset automatic move because of anarchy moves
   */
  resetAutomaticMove() {
    clearTimeout(this.timeoutAutomaticMove);

    const snakeSpeed = this.snakeService.getSnakeSpeed();

    // prepare to move automatically
    this.timeoutAutomaticMove = setTimeout(() => this.doAutomaticMove(), snakeSpeed)
  }

  /**
   * Prevent snake idling, move automatically
   */
  doAutomaticMove() {
    // in democracy mode, new direction is determined on next move
    if (this.democracyService.isDemocracyActive()) {
      if (this.getCountMovesInQueue() > 0) {
        const prevalentDirection = this.determinePrevalentDirection()

        if (prevalentDirection) {
          this.controlsService.setDirection(prevalentDirection.direction);

          let username = `${prevalentDirection.votesPrevalentDirection} vote`;
          if (prevalentDirection.votesPrevalentDirection !== 1) {
            username = `${prevalentDirection.votesPrevalentDirection} votes`;
          }

          this.statsService.incrementMove();
          this.statsLastActionService.addToLastActions({
            username,
            direction: prevalentDirection.direction,
          });

          this.resetMovesInQueue();
        }
      }
    }

    this.snakeService.nextMove();
    this.resetAutomaticMove();
    this.resetPlayers();
  }

  /**
   * Add direction to moves queue
   *
   * @param username
   * @param ip
   * @param direction
   */
  addDirectionToMovesQueue(username: string, ip: string, direction: string) {
    // in anarchy mode, send every move to queue
    // in democracy mode, check if it's the first player move
    if (
      !this.democracyService.isDemocracyActive() ||
      this.democracyService.isDemocracyActive() && !this.hasPlayerAlreadySentMove(ip)
    ) {
      // add move to queue
      this.movesQueue.push({ username, direction });
      this.addPlayer(ip);
    }
  }

  addPlayer(ip: string) {
    return this.players.push(ip)
  }

  resetPlayers() {
    this.players = []
  }

  hasPlayerAlreadySentMove(ip: string) {
    return this.players.includes(ip)
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

  resetMovesInQueue() {
    this.movesQueue = []
  }

  /**
   * Process next move in queue (determine timings and run it)
   */
  processNextMoveInQueue() {
    this.resetAutomaticMove();

    if (this.getCountMovesInQueue() > 0) {
      if (((+ new Date()) - this.lastMoveSent) > 500) {
        // last move sent is < 1000, do move immediately
        this.doNextMoveInQueue();
      } else {
        setTimeout(() => {
          // wait some time before do next move, then call this method again
          // (there are others moves in queue)
          this.doNextMoveInQueue();
          this.processNextMoveInQueue()
        }, 300);
      }
    }
  }

  /**
   * Apply next move in queue
   */
  doNextMoveInQueue() {
    const nextMove = this.getNextMoveInQueue();

    if (this.controlsService.isOppositeDirection(nextMove.direction)) {
      // when damaged, can do opposite direction
      if (!this.snakeService.isDamaged()) {
        // delete move, not more needed
        this.movesQueue.shift();

        // skip move
        if (this.getCountMovesInQueue() > 0) {
          this.doNextMoveInQueue()
        }

        return false;
      }
    }

    this.statsService.incrementMove();
    this.statsLastActionService.addToLastActions(nextMove);
    this.controlsService.setDirection(nextMove.direction);

    this.resetAutomaticMove();

    // prevent face2ass after 120 sec
    clearTimeout(this.timeoutCheckSnakeAssDistance);
    this.timeoutCheckSnakeAssDistance = setTimeout(() => this.checkSnakeAssDistance(), 120000);

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

  private checkSnakeAssDistance() {
    if (this.snakeService.getSnake().body.length === 20) {
      this.snakeService.removeLength();
    }
  }
}
