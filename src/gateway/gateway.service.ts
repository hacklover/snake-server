import { Injectable } from '@nestjs/common';
import { Stats } from '../interfaces/common.interface';
import { Subject } from 'rxjs';

const snakeGameStream: Subject<any> = new Subject<any>();

let snakeGameCache = {};

@Injectable()
export class GatewayService {
  private stats: Stats;

  // snake server sent events
  static emit(name: string, data: any) {
    // cache savegame in memory
    if (name === 'snake-update') snakeGameCache = { name, data };

    // append game update
    snakeGameStream.next({ name, data });
  }

  static getGameCache() {
    return snakeGameCache
  }

  static getGameStream() {
    return snakeGameStream
  }
}
