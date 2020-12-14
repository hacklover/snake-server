import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface GameStorageSnake {
  mode: string;
  direction: string;
  speed: number;
  body: any[];
  damaged: boolean;
}
export interface GameStorageStats {
  score: number;
  goodies: number;
  moves: number;
}

@Schema()
export class GameStorage extends Document {
  snake: GameStorageSnake;
  goodies: any[];
  stats: GameStorageStats;
}

export const GameStorageSchema = SchemaFactory.createForClass(GameStorage);

// default game storage values
export const GameStorageDefaultValues = {
  snake: {
    mode: 'default',
    direction: 'right',
    speed: 5000,
    body: [],
    damaged: false,
  },
  goodies: [],
  stats: {
    score: 0,
    goodies: 0,
    moves: 0
  }
}