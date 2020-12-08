import { Injectable } from '@nestjs/common';

@Injectable()
export class ControlsService {
  // valid directions
  private readonly validDirections: string[] = ['up', 'left', 'right', 'down'];

  // current direction
  private direction: string;

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

    switch (direction) {
      case 'up':
        if (currentDirection === 'down') return true;
        break;
      case 'down':
        if (currentDirection === 'up') return true;
        break;
      case 'left':
        if (currentDirection === 'right') return true;
        break;
      case 'right':
        if (currentDirection === 'left') return true;
        break;
    }

    return false
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
}
