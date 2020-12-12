import {Module, Global} from '@nestjs/common';
import { GameService } from './game.service';
import {GameInactiveService} from "./game-inactive/game-inactive.service";
import {GoodiesModule} from "../goodies/goodies.module";
import {StatsModule} from "../stats/stats.module";
import {MovesModule} from "../moves/moves.module";
import { StorageModule } from '../storage/storage.module';

@Global()
@Module({
  imports: [
    StorageModule,
    GoodiesModule,
    MovesModule,
    StatsModule,
  ],
  providers: [GameService,GameInactiveService],
  exports: [GameService,GameInactiveService]
})

export class GameModule {}