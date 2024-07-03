import { Vector3, Euler } from "three";

export type PlayerID = string;

export interface Player {
  id: PlayerID;
  position: Vector3;
  rotation: Euler;
  state: "idle" | "running" | "walking" | "jumping";
}

export class PlayerData implements Player {
  id: PlayerID;
  position: Vector3;
  rotation: Euler;
  state: "idle" | "running" | "walking" | "jumping";

  constructor(
    id: PlayerID,
    x: number,
    y: number,
    z: number,
    rotationX: number,
    rotationY: number,
    rotationZ: number,
    state: "idle" | "running" | "walking" | "jumping",
  ) {
    this.id = id;
    this.position = new Vector3(x, y, z);
    this.rotation = new Euler(rotationX, rotationY, rotationZ);
    this.state = state;
  }

  updatePosition(x: number, y: number, z: number) {
    this.position.set(x, y, z);
  }

  updateRotation(rotationX: number, rotationY: number, rotationZ: number) {
    this.rotation.set(rotationX, rotationY, rotationZ);
  }

  updateState(state: "idle" | "running" | "walking" | "jumping") {
    this.state = state;
  }
}

export const players: Map<PlayerID, PlayerData> = new Map();
