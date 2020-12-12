import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameStorage } from '../../interfaces/storage.interface';

@Injectable()
export class MongodbService {
  constructor(
    @InjectModel('GameStorage') private readonly storageModel: Model<GameStorage>,
  ) {}

  /**
   * Load game from storage
   */
  async readGameSave() {
    return await this.storageModel.find().exec();
  }

  /**
   * Save game to storage
   */
  async writeGameSave(game) {
    const gameStorageState = new this.storageModel(game);
    return gameStorageState.save();
  }
}
