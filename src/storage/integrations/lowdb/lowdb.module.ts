import { Module } from '@nestjs/common';
import { LowdbService } from './lowdb.service';

@Module({
  providers: [LowdbService],
  exports: [LowdbService]
})
export class LowdbModule {
  constructor(private readonly lowdbService: LowdbService) {
    // initialize storage/db.json
    this.lowdbService.initializeGameStorage()
  }
}
