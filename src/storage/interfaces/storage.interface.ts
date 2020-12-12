import { Document } from 'mongoose';

export interface GameStorage extends Document {
  readonly snake: {
    mode: string;
    direction: string;
    speed: number;
    body: any[];
    damaged: boolean;
  };
  readonly goodies: any[];
  readonly stats: {
    score: number;
    goodies: number;
    moves: number;
  }
}