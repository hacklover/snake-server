import { Injectable, OnModuleInit } from '@nestjs/common';
import { LowdbService } from './integrations/lowdb/lowdb.service';
import { MongodbService } from './integrations/mongodb/mongodb.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class StorageService implements OnModuleInit {
  private lowdbService: LowdbService;
  private mongodbService: MongodbService;

  constructor(
    private moduleRef: ModuleRef
  ) {}

  /**
   * Resolve active storage service dynamically
   * (avoid to connect to mongodb when another db is selected)
   */
  async onModuleInit() {
    switch(StorageService.storageType) {
      case 'mongodb':
        this.mongodbService = await this.moduleRef.resolve(MongodbService)
        break;
      case 'lowdb':
        this.lowdbService = await this.moduleRef.resolve(LowdbService)
        break;
    }
  }

  /**
   * Return storage type from env variable
   */
  static get storageType() {
    return process.env.STORAGE_TYPE || 'lowdb'
  }

  /**
   * Get active storage service
   */
  get storageService() {
    switch(StorageService.storageType) {
      case 'mongodb':
        return 'mongodbService'
      case 'lowdb':
        return 'lowdbService'
    }
  }

  /**
   * Load game from storage
   */
  public readGameSave(): any {
    return this[this.storageService].readGameSave()
  }

  /**
   * Save game to storage
   */
  public writeGameSave(game) {
    this[this.storageService].writeGameSave(game)
  }
}
