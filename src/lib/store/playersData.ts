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
    player?: Player,
    id?: PlayerID,
    x?: number,
    y?: number,
    z?: number,
    rotationX?: number,
    rotationY?: number,
    rotationZ?: number,
    state?: "idle" | "running" | "walking" | "jumping",
  ) {
    if (player) {
      this.id = player.id;
      this.position = player.position;
      this.rotation = player.rotation;
      this.state = player.state;
      return;
    }
    if (!id) throw new Error("neither player nor id were provided");
    this.id = id;

    this.position = new Vector3(
      x ?? randomCoordinate(),
      y ?? randomCoordinate(),
      z ?? randomCoordinate(),
    );
    this.rotation = new Euler(
      rotationX ?? randomRotation(),
      rotationY ?? randomRotation(),
      rotationZ ?? randomRotation(),
    );

    this.state = state ?? "idle";
  }

  updatePosition(x: number, y: number, z: number) {
    // this.position.set(x, y, z);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }

  updateRotation(rotationX: number, rotationY: number, rotationZ: number) {
    this.rotation.set(rotationX, rotationY, rotationZ);
  }

  updateState(state: "idle" | "running" | "walking" | "jumping") {
    this.state = state;
  }
}

const randomCoordinate = () => Math.random() * 10 - 5;
const randomRotation = () => Math.random() * Math.PI * 2;

export const players: Map<PlayerID, PlayerData> = new Map();
