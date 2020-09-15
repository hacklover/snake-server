import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsLastActionService {
  private lastActions = [];

  getLastActions() {
    return this.lastActions
  }

  resetLastActions() {
    this.lastActions = [];
  }

  addToLastActions(lastAction) {
    this.lastActions.push(lastAction)
  }
}
