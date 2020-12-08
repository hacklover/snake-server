import { Injectable } from '@nestjs/common';

@Injectable()
export class GameInactiveService {
  private secondsSinceLastMove: number = 0;

  /**
   * Increment seconds to track game inactivity
   */
  incrementSecondsSinceLastMove() {
    this.secondsSinceLastMove++
  }

  /**
   * resetSnake seconds since last move
   */
  resetSnakeSecondsSinceLastMove() {
    this.secondsSinceLastMove = 0;
  }

  /**
   * Check if game is inactive from more than X minutes
   *
   * @param minutes
   */
  isInactiveMoreThanMinutes(minutes: number) {
    return (this.secondsSinceLastMove / 60) > minutes
  }
}
