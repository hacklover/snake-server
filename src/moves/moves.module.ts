import { Module,Global } from '@nestjs/common';
import { MovesService } from './moves.service';

@Global()
@Module({
  providers: [MovesService],
  exports: [MovesService]
})
export class MovesModule {}
