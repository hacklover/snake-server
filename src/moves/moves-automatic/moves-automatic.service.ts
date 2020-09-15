import { Injectable, Inject, forwardRef } from '@nestjs/common';
import {SnakeService} from "../../snake/snake.service";
import {DemocracyService} from "../../democracy/democracy.service";
import {MovesService} from "../moves.service";
import {ControlsService} from "../../controls/controls.service";
import {StatsService} from "../../stats/stats.service";
import {StatsLastActionService} from "../../stats/stats-last-action.service";
import {PlayersService} from "../../players/players.service";

@Injectable()
export class MovesAutomaticService {
  private timeoutAutomaticMove: any;

  constructor(
    @Inject(forwardRef(() => MovesService)) private readonly movesService: MovesService,
    private readonly snakeService: SnakeService,
    private readonly statsService: StatsService,
    private readonly statsLastActionService: StatsLastActionService,
    private readonly democracyService: DemocracyService,
    private readonly controlsService: ControlsService,
    private readonly playersService: PlayersService
  ) {

  }

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
    /*
    if (this.democracyService.isDemocracyActive()) {
      if (this.movesService.getCountMovesInQueue() > 0) {
        const prevalentDirection = this.movesService.determinePrevalentDirection()

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

          this.movesService.resetMovesInQueue();
        }
      }
    }
    */

    this.resetAutomaticMove();
    this.snakeService.nextMove();
    this.playersService.resetPlayers();
  }
}
