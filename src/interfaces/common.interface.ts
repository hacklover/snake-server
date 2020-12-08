export interface Game {
  snake: Snake;
  goodies: Goody[];
  stats: Stats;
}

export interface Snake {
  mode: string;
  direction: string;
  speed: number;
  body: any[];
  damaged: boolean;
}

export interface Goody {
  type: number;
  pos: any[];
}

export interface Stats {
  score: number;
  goodies: number;
  moves: number;
}

export interface SnakeMove {
  user: User;
  direction: string;
}

export interface User {
  username: string;
  ip: string;
}
