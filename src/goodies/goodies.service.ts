import { Injectable } from '@nestjs/common';
import { Goodie } from '../interfaces/common.interface';

@Injectable()
export class GoodiesService {
  // goodies active
  private goodies: Goodie[] = [];

  // list for random goodies (purely shit code but it's ok)
  private randomGoodiesAvailability: number[] = [0, 0, 0, 1, 1, 1, 2, 4, 4, 4, 5, 5];

  public getGoodies() {
    return this.goodies;
  }

  public getGoodiesCount() {
    return this.goodies.length;
  }

  public setGoodies(goodies: Goodie[]) {
    this.goodies = goodies;
  }

  /**
   * Create new goodie
   *
   * @param type
   * @param pos
   */
  public addGoodie(type: number = 0, pos: number[] = [-1,-1]) {
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
   * Create random goodie
   */
  public addRandomGoodie() {
    // drop it
    const randomGoodieIndex = Math.floor(Math.random() * (this.randomGoodiesAvailability.length + 1));
    const randomGoodieType = this.randomGoodiesAvailability[randomGoodieIndex];

    this.addGoodie(randomGoodieType);
  }

  /**
   * Get goodie score
   *
   * @param goodie
   */
  static getGoodieScore(goodie) {
    let score;

    switch (goodie.type) {
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
