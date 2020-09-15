import { Injectable } from '@nestjs/common';
import {GameService} from "./game/game.service";

@Injectable()
export class AppService {
  constructor(
    private readonly gameService: GameService,
  ) {
    this.gameService.loadGame();
  }
}
