import {Module} from '@nestjs/common';
import { MovesService } from './moves.service';
import {StatsModule} from "../stats/stats.module";
import {PlayersModule} from "../players/players.module";
import { MovesAutomaticService } from './moves-automatic/moves-automatic.service';

@Module({
  imports:[
    StatsModule,
    PlayersModule,
  ],
  providers: [MovesService, MovesAutomaticService],
  exports: [MovesService,MovesAutomaticService]
})
export class MovesModule {}