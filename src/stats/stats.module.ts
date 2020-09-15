import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import {StatsLastActionService} from "./statsLastAction.service";

@Module({
  providers: [StatsService,StatsLastActionService],
  exports: [StatsService,StatsLastActionService],
})
export class StatsModule {}
