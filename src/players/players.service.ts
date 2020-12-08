import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayersService {
  private players: any[] = [];

  /**
   * Add player ip
   *
   * @param ip
   */
  addPlayer(ip: string) {
    if (!this.isPlayerInList(ip)) {
      return this.players.push(ip)
    }

    return false
  }

  /**
   * resetSnake players
   */
  resetSnakePlayers() {
    this.players = []
  }

  /**
   * Check if player ip already in list
   *
   * @param ip
   */
  isPlayerInList(ip: string) {
    return this.players.includes(ip)
  }
}
