import { Module,Global } from '@nestjs/common';
import { SnakeService } from './snake.service';

@Global()
@Module({
  providers: [SnakeService],
  exports: [SnakeService],
})

export class SnakeModule {
  constructor(private readonly snakeService: SnakeService) {
    setInterval(() => this.snakeService.inactivityCheck(), 10000);
  }
}
