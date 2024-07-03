import { addOrUpdatePlayer, removePlayer } from "./playersManager";
import type { PlayerID } from "./playersData";

export function initializePlayerData() {
  for (let i = 0; i < 10; i++) {
    const id = `player-${i}` as PlayerID;
    const x = Math.random() * 10 - 5;
    const y = Math.random() * 10 - 5;
    const z = Math.random() * 10 - 5;
    const rotationX = Math.random() * Math.PI * 2;
    const rotationY = Math.random() * Math.PI * 2;
    const rotationZ = Math.random() * Math.PI * 2;
    const state = ["idle", "running", "walking", "jumping"][
      Math.floor(Math.random() * 3)
    ] as "idle" | "running" | "walking" | "jumping";
    addOrUpdatePlayer(id, x, y, z, rotationX, rotationY, rotationZ, state);
  }
}

export function startP2PUpdates(
  callback: (
    id: PlayerID,
    x: number,
    y: number,
    z: number,
    rotationX: number,
    rotationY: number,
    rotationZ: number,
    state: "idle" | "running" | "walking" | "jumping",
  ) => void,
  interval: number = 1000,
) {
  // Simulate P2P updates
  setInterval(() => {
    const id = `player-${Math.floor(Math.random() * 10)}` as PlayerID;
    const x = Math.random() * 10 - 5;
    const y = Math.random() * 10 - 5;
    const z = Math.random() * 10 - 5;
    const rotationX = Math.random() * Math.PI * 2;
    const rotationY = Math.random() * Math.PI * 2;
    const rotationZ = Math.random() * Math.PI * 2;
    const state = ["idle", "running", "walking", "jumping"][
      Math.floor(Math.random() * 3)
    ] as "idle" | "running" | "walking" | "jumping";
    callback(id, x, y, z, rotationX, rotationY, rotationZ, state);
  }, interval);
}
