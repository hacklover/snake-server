import * as mongoose from 'mongoose';

// interfaces

export interface GameStorageSnake {
  mode: string;
  direction: string;
  speed: number;
  body: any[][];
  damaged: boolean;
}
export interface GameStorageGoody {
  type: number;
  pos: number[];
}
export interface GameStorageStats {
  score: number;
  goodies: number;
  moves: number;
}

// mongodb schema
export const GameStorageSchemaName = 'GameStorageDocument';
export const GameStorageSchema = new mongoose.Schema({
  snake: { type: Object },
  goodies: { type: Array },
  stats: { type: Object }
})

// mongodb document
export interface GameStorageDocument extends mongoose.Document {
  readonly _id: mongoose.Schema.Types.ObjectId;
  readonly snake: GameStorageSnake;
  readonly goodies: GameStorageGoody[];
  readonly stats: GameStorageStats;
}

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