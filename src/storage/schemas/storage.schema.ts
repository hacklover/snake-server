import * as mongoose from 'mongoose';

export const GameStorageSchema = new mongoose.Schema({
  snake: {
    mode: String,
    direction: String,
    speed: Number,
    body: Array,
    damaged: Boolean,
  },
  goodies: Array,
  stats: {
    score: Number,
    goodies: Number,
    moves: Number
  }
});

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