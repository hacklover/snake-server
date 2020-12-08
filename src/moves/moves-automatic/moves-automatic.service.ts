import { Injectable, Inject, forwardRef } from '@nestjs/common';
import {SnakeService} from "../../snake/snake.service";
import {MovesService} from "../moves.service";
import {ControlsService} from "../../controls/controls.service";
import {StatsService} from "../../stats/stats.service";
import {StatsLastActionService} from "../../stats/stats-last-action.service";
import {PlayersService} from "../../players/players.service";

@Injectable()
export class MovesAutomaticService {
  private timeoutAutoMove: any;

  constructor(
    @Inject(forwardRef(() => MovesService)) private readonly movesService: MovesService,
    private readonly snakeService: SnakeService,
    private readonly statsService: StatsService,
    private readonly statsLastActionService: StatsLastActionService,
    private readonly controlsService: ControlsService,
    private readonly playersService: PlayersService
  ) {}

  /**
   * resetSnake automatic move because of anarchy moves
   */
  resetSnakeSnakeAutoMoveTimeout() {
    const snakeSpeed = this.snakeService.getSnakeSpeed();

    clearTimeout(this.timeoutAutoMove);

    // move snake automatically in {snakeSpeed} seconds
    this.timeoutAutoMove = setTimeout(() => {
      this.doAutomaticMove()
      this.resetSnakeSnakeAutoMoveTimeout()
    }, snakeSpeed)
  }

  /**
   * Prevent snake idling, move automatically
   */
  doAutomaticMove() {
    this.snakeService.nextMove();
    this.playersService.resetSnakePlayers();
  }
}
