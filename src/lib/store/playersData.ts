import { Vector3 } from 'three';

export type PlayerID = string;

export interface Player {
  id: PlayerID;
  position: Vector3;
  rotation: Vector3;
  state: 'running' | 'walking' | 'jumping';
}

export class PlayerData implements Player {
  id: PlayerID;
  position: Vector3;
  rotation: Vector3;
  state: 'running' | 'walking' | 'jumping';

  constructor(id: PlayerID, x: number, y: number, z: number, rotationY: number, state: 'running' | 'walking' | 'jumping') {
    this.id = id;
    this.position = new Vector3(x, y, z);
    this.rotation = new Vector3(0, rotationY, 0);
    this.state = state;
  }

  updatePosition(x: number, y: number, z: number) {
    this.position.set(x, y, z);
  }

  updateRotation(rotationY: number) {
    this.rotation.set(0, rotationY, 0);
  }

  updateState(state: 'running' | 'walking' | 'jumping') {
    this.state = state;
  }
}

export const players: Map<PlayerID, PlayerData> = new Map();
