import { Module,Global } from '@nestjs/common';
import { ControlsService } from './controls.service';
import { ControlsController } from './controls.controller';

@Global()
@Module({
  controllers: [ControlsController],
  providers: [ControlsService],
  exports: [ControlsService],
})
export class ControlsModule {}
