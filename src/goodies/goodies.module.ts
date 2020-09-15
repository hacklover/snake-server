import {Module,Global} from '@nestjs/common';
import { GoodiesService } from './goodies.service';

@Global()
@Module({
  providers: [GoodiesService],
  exports: [GoodiesService],
})
export class GoodiesModule {}
