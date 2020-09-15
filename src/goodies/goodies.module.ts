import {Module} from '@nestjs/common';
import { GoodiesService } from './goodies.service';

@Module({
  providers: [GoodiesService],
  exports: [GoodiesService],
})
export class GoodiesModule {}
