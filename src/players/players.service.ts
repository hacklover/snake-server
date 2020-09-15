import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayersService {
  private players: any[] = [];

  addPlayer(ip: string) {
    if (!this.isPlayerAlreadyinList(ip)) {
      return this.players.push(ip)
    }

    return false
  }

  resetPlayers() {
    this.players = []
  }

  isPlayerAlreadyinList(ip: string) {
    return this.players.includes(ip)
  }
}
