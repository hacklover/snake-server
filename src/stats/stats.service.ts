import { Injectable } from '@nestjs/common';
import { Stats } from '../interfaces/common.interface';

@Injectable()
export class StatsService {
  private stats: Stats = {
    score: 0,
    goodies: 0,
    moves: 0
  };

  getStats() {
    return this.stats;
  }

  setStats(stats: Stats) {
    this.stats = stats;
  }

  incrementScore(score: number) {
    this.stats.score += score;
  }

  incrementMove() {
    this.stats.moves++;
  }

  incrementGoody() {
    this.stats.goodies++;
  }
}
