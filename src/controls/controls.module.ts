import { Module,Global } from '@nestjs/common';
import { ControlsService } from './controls.service';
import { ControlsController } from './controls.controller';
import {StatsModule} from "../stats/stats.module";
import {MovesModule} from "../moves/moves.module";

@Global()
@Module({
  imports: [
    StatsModule,
    MovesModule,
  ],
  controllers: [ControlsController],
  providers: [ControlsService],
  exports: [ControlsService],
})
export class ControlsModule {}