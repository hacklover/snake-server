import { Injectable } from '@nestjs/common';

@Injectable()
export class GameInactiveService {
  private secondsSinceLastMove: number = 0;

  constructor() {
    setInterval(() => this.secondsSinceLastMove++, 1000);
  }

  getSecondsSinceLastMove() {
    return this.secondsSinceLastMove;
  }

  resetSecondsSinceLastMove() {
    this.secondsSinceLastMove = 0;
  }

  isInactiveMoreThanMinutes(minutes: number) {
    return (this.secondsSinceLastMove / 60) > minutes
  }
}
