import { Module,Global } from '@nestjs/common';
import { StatsService } from './stats.service';
import {StatsLastActionService} from "./statsLastAction.service";

@Global()
@Module({
  providers: [StatsService,StatsLastActionService],
  exports: [StatsService,StatsLastActionService],
})
export class StatsModule {}
