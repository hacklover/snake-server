import { Injectable } from '@nestjs/common';
import {GameService} from '../game/game.service';

// https://github.com/typicode/lowdb
import lowdb = require('lowdb');
import FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('storage/db.json');
const db = lowdb(adapter);

@Injectable()
export class StorageService {
  constructor() {
    // initialize db
    db.defaults({
      game: GameService.getNewGameDefaultState()
    }).write();
  }

  /**
   * Load game from storage
   */
  static readGameSave() {
    return db.get('game').value();
  }

  /**
   * Save game to storage
   */
  static writeGameSave(game) {
    db.set('game', game).write();
  }
}
