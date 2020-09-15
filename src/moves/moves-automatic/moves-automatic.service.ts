import { Injectable, Inject, forwardRef } from '@nestjs/common';
import {SnakeService} from "../../snake/snake.service";
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
    this.resetAutomaticMove();
    this.snakeService.nextMove();
    this.playersService.resetPlayers();
  }
}
