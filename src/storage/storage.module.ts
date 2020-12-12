import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { MongodbModule } from './integrations/mongodb/mongodb.module';
import { LowdbModule } from './integrations/lowdb/lowdb.module';
import { LowdbService } from './integrations/lowdb/lowdb.service';
import { MongodbService } from './integrations/mongodb/mongodb.service';

let activeStorageModule: any[] = [];
let activeStorageService: any[] = [];

switch(StorageService.storageType) {
  case 'mongodb':
    activeStorageModule = [
      MongodbModule,
    ];
    activeStorageService = [MongodbService];
    break;
  case 'lowdb':
    activeStorageModule = [LowdbModule];
    activeStorageService = [LowdbService];
    break;
}

@Module({
  imports: activeStorageModule,
  providers: [StorageService,...activeStorageService],
  exports: [StorageService],
})
export class StorageModule {}
