import { Injectable } from '@nestjs/common';
import { StatsService } from '../stats/stats.service';
import {GameInactiveService} from "../game/game-inactive.service";

@Injectable()
export class ControlsService {
  private readonly validDirections: string[] = ['up', 'left', 'right', 'down'];
  private direction: string;

  constructor(
    private readonly statsService: StatsService,
    private readonly controlsInactivityService: GameInactiveService
  ) {}

  /**
   * Get current direction
   */
  getDirection() {
    return this.direction;
  }

  /**
   * Set current direction
   *
   * @param direction
   */
  setDirection(direction: string) {
    this.direction = direction;
  }

  /**
   * Check if direction is valid
   *
   * @param direction
   */
  isValidDirection(direction: string) {
    return this.validDirections.includes(direction);
  }

  /**
   * Is direction opposite of current direction
   *
   * @param direction
   */
  isOppositeDirection(direction: string) {
    const currentDirection = this.getDirection();

    // prevent opposite direction
    switch (direction) {
      case 'up':
        if (currentDirection === 'down') {
          return true;
        }
        break;
      case 'down':
        if (currentDirection === 'up') {
          return true;
        }
        break;
      case 'left':
        if (currentDirection === 'right') {
          return true;
        }
        break;
      case 'right':
        if (currentDirection === 'left') {
          return true;
        }
        break;
    }

    return false
  }

  /**
   * Is direction the same current direction
   *
   * @param direction
   */
  isDirectionSameAsCurrent(direction: string) {
    const currentDirection = this.getDirection();

    return (currentDirection === direction)
  }

  /**
   * Get random direction
   */
  getRandomDirection() {
    const validDirections = [...this.validDirections];

    // remove current direction
    const index = validDirections.indexOf(this.direction);

    if (index !== -1) {
      validDirections.splice(index, 1);
    }

    return validDirections[Math.floor(Math.random() * validDirections.length)];
  }

  /**
   * Apply direction
   *
   * @param direction
   */
  applyDirection(direction: string) {
    // reset seconds last move
    this.controlsInactivityService.resetSecondsSinceLastMove();

    // set snake direction
    this.setDirection(direction);
  }
}
