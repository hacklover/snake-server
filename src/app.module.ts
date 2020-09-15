import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnakeModule } from './snake/snake.module';
import { ControlsModule } from './controls/controls.module';
import { StorageModule } from './storage/storage.module';
import { GoodiesModule } from './goodies/goodies.module';
import { UtilsModule } from './utils/utils.module';
import { StatsModule } from './stats/stats.module';
import { GatewayModule } from './gateway/gateway.module';
import { DemocracyModule } from './democracy/democracy.module';
import { GameModule } from './game/game.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    GameModule,
    SnakeModule,
    GoodiesModule,
    ControlsModule,
    DemocracyModule,
    GatewayModule,
    StatsModule,
    StorageModule,
    UtilsModule,
    PlayersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
