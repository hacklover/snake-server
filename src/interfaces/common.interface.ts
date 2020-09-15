export interface Game {
  snake: Snake;
  goodies: Goodie[];
  stats: Stats;
  democracyLevel: number;
}

export interface Snake {
  mode: string;
  direction: string;
  speed: number;
  body: any[];
  damaged: boolean;
}

export interface Goodie {
  type: number;
  pos: any[];
}

export interface Stats {
  score: number;
  goodies: number;
  moves: number;
}

export interface LastMove {
  user: number;
  direction: string;
}

export interface User {
  username: string;
  ip: string;
}
