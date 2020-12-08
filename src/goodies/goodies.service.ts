import { Injectable } from '@nestjs/common';
import { Goody } from '../interfaces/common.interface';

@Injectable()
export class GoodiesService {
  // goodies active
  private goodies: Goody[] = [];

  // list for random goodies (purely shit code but it's ok)
  private randomGoodiesAvailability: number[] = [0, 0, 0, 1, 1, 1, 2, 4, 4, 4, 5, 5];

  /**
   * Get goodies ist
   */
  public getGoodies() {
    return this.goodies;
  }

  /**
   * Get goodies count
   */
  public getGoodiesCount() {
    return this.goodies.length;
  }

  /**
   * Set cookies
   *
   * @param goodies
   */
  public setGoodies(goodies: Goody[]) {
    this.goodies = goodies;
  }

  /**
   * Create new goody
   *
   * @param type
   * @param pos
   */
  public addGoody(type: number = 0, pos: number[] = [-1,-1]) {
    if (pos[0] === -1) {
      // choose random x position
      pos[0] = Math.floor(Math.random() * Number(process.env.SNAKE_STAGE_WIDTH));
    }

    if (pos[1] === -1) {
      // choose random y position
      pos[1] = Math.floor(Math.random() * Number(process.env.SNAKE_STAGE_HEIGHT));
    }

    // todo check if coordinate is available

    this.goodies.push({ type, pos });
  }

  /**
   * Create random goody
   */
  public addRandomGoody() {
    const randomGoodyIndex = Math.floor(Math.random() * (this.randomGoodiesAvailability.length + 1));
    const randomGoodyType = this.randomGoodiesAvailability[randomGoodyIndex];

    this.addGoody(randomGoodyType);
  }

  /**
   * Get goodie score
   *
   * @param goody
   */
  static getGoodyScore(goody: Goody) {
    let score;

    switch (goody.type) {
      case 1:
        score = 50;
        break;
      case 4:
        score = 25;
        break;
      case 5:
        score = 15;
        break;
      default:
        score = 10;
        break;
    }

    return score;
  }
}
