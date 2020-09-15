import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {GatewayService} from '../gateway.service';
import { Server } from 'socket.io';

// todo currently not working

@WebSocketGateway(80, { namespace: 'events' })
export class WsGateway {
  @WebSocketServer()
  server: Server;

  users: number = 0;

  constructor() {
    const snakeGameCache = GatewayService.getGameCache();
    const snakeGameStream = GatewayService.getGameStream();
  }

  async handleConnection() {
    this.users++;
  }

  async handleDisconnect() {
    this.users--;
  }

  @SubscribeMessage('events')
  async identity(client, @MessageBody() data: number): Promise<number> {
    client.broadcast.emit('chat', 'test');
    return data;
  }
}