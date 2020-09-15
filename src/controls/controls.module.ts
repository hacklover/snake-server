import { Module,forwardRef } from '@nestjs/common';
import { ControlsService } from './controls.service';
import { ControlsController } from './controls.controller';
import {DemocracyModule} from "../democracy/democracy.module";
import {SnakeModule} from "../snake/snake.module";
import {StatsModule} from "../stats/stats.module";
import {MovesModule} from "../moves/moves.module";

@Module({
  imports: [
    forwardRef(() => DemocracyModule),
    forwardRef(() => SnakeModule),
    forwardRef(() => StatsModule),
    forwardRef(() => MovesModule),
  ],
  controllers: [ControlsController],
  providers: [ControlsService],
  exports: [ControlsService],
})
export class ControlsModule {}
