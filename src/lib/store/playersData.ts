export type PlayerID = string;

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Player {
  id: PlayerID;
  position: Position;
  direction: number;
  state: 'running' | 'walking' | 'jumping';
}

export class PlayerData implements Player {
  id: PlayerID;
  position: Position;
  direction: number;
  state: 'running' | 'walking' | 'jumping';

  constructor(id: PlayerID, x: number, y: number, z: number, direction: number, state: 'running' | 'walking' | 'jumping') {
    this.id = id;
    this.position = { x, y, z };
    this.direction = direction;
    this.state = state;
  }

  updatePosition(x: number, y: number, z: number) {
    this.position = { x, y, z };
  }

  updateDirection(direction: number) {
    this.direction = direction;
  }

  updateState(state: 'running' | 'walking' | 'jumping') {
    this.state = state;
  }
}

export const players: Map<PlayerID, PlayerData> = new Map();
