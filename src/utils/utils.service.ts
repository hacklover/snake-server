import { Global, Injectable } from '@nestjs/common';

@Global()
@Injectable()
export class UtilsService {
  static randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static parseUsername(username: string): string {
    if (username) {
      username = username.trim();
      username = username.replace(/[^a-zA-Z0-9_.#-]/g, '');
    }

    if (!username || username === '') {
      username = 'unknown';
    } else {
      if (username.length > 16) {
        username = username.substr(0, 16);
      }
    }

    return username;
  }
}
