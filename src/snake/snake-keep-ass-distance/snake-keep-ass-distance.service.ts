import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {SnakeService} from "../snake.service";

@Injectable()
export class SnakeKeepAssDistanceService {
  private timeoutKeepAssDistance: any;

  constructor(
    @Inject(forwardRef(() => SnakeService)) private readonly snakeService: SnakeService,
  ) {}

  public resetSnakeAssDistanceCheck() {
    clearTimeout(this.timeoutKeepAssDistance);
    this.timeoutKeepAssDistance = setTimeout(() => this.checkSnakeAssDistance(), 120000);
  }

  private checkSnakeAssDistance() {
    if (this.snakeService.getSnake().body.length === 20) {
      this.snakeService.removeLength();
    }
  }
}
