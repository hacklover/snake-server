import { Injectable } from '@nestjs/common';
import {GameService} from "./game/game.service";
import {SnakeService} from "./snake/snake.service";

@Injectable()
export class AppService {
  constructor(
    private readonly gameService: GameService,
    private readonly snakeService: SnakeService
  ) {
    this.gameService.loadGame();
  }
}
