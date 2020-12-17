import { Injectable } from '@nestjs/common';
import { GameStorageDefaultValues } from '../../schemas/storage.schema';

import lowdb = require('lowdb');
import FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(`storage/${process.env.STORAGE_LOWDB_DATABASE}`);

@Injectable()
export class LowdbService {
  private db: any = lowdb(adapter);

  /**
   * Initialize storage/db.json
   */
  initializeGameStorage() {
    this.db.defaults({ game: GameStorageDefaultValues }).write();
  }

  /**
   * Load game from lowdb storage
   */
  readGameSave() {
    return this.db.get('game').value();
  }

  /**
   * Save game to lowdb storage
   */
  writeGameSave(game) {
    this.db.set('game', game).write();
  }
}
