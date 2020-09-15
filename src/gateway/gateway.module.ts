import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SSEMiddleware } from 'nestjs-sse';
import {GatewayService} from './gateway.service';
import {SseGateway} from './gateways/sse.gateway';

@Module({
  controllers: [SseGateway],
  providers: [GatewayService],
  exports: [],
})
export class GatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SSEMiddleware).forRoutes(SseGateway);
  }
}
