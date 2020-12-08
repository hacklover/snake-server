import {Injectable} from '@nestjs/common';
import {SnakeService} from "../snake.service";

@Injectable()
export class SnakeKeepAssDistanceService {
  private timeoutKeepAssDistance: any;

  constructor(
    private readonly snakeService: SnakeService,
  ) {}

  public resetSnakeSnakeAssDistanceCheck() {
    clearTimeout(this.timeoutKeepAssDistance);
    this.timeoutKeepAssDistance = setTimeout(() => this.checkSnakeAssDistance(), 120000);
  }

  private checkSnakeAssDistance() {
    if (this.snakeService.getSnake().body.length === 20) {
      this.snakeService.removeSnakeLength();
    }
  }
}
