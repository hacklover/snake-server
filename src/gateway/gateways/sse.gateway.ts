import { Controller, Get, Res } from '@nestjs/common';
import {GatewayService} from '../gateway.service';
import { Response } from 'nestjs-sse';

@Controller('api/sse')
export class SseGateway {

  @Get()
  get(@Res() res: Response) {
    const snakeGameCache = GatewayService.getGameCache();
    const snakeGameStream = GatewayService.getGameStream();

    res.sse(`data: ${JSON.stringify(snakeGameCache)}\n\n`);

    // update when observer is triggered
    snakeGameStream.subscribe({
      next: data => res.sse(`data: ${JSON.stringify(data)}\n\n`)
    });
  }
}