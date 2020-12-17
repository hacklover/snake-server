import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameStorageDocument, GameStorageSchemaName, GameStorageDefaultValues } from '../../schemas/storage.schema';

@Injectable()
export class MongodbService {
  constructor(
    @InjectModel(GameStorageSchemaName) private readonly gameStorageModel: Model<GameStorageDocument>,
  ) {}

  /**
   * New game mongodb document
   */
  async newGameSave() {
    const gameSaveDocument = new this.gameStorageModel(GameStorageDefaultValues);

    return gameSaveDocument.save()
  }

  /**
   * Load game from storage
   */
  async readGameSave() {
    const gameSaveDocument = await this.gameStorageModel.findOne()

    if (!gameSaveDocument) {
      return await this.newGameSave()
    }

    return gameSaveDocument
  }

  /**
   * Save game to storage
   */
  async writeGameSave(game) {
    await this.gameStorageModel.updateOne({}, game)
  }
}
