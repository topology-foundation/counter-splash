import { addOrUpdatePlayer, removePlayer } from './playersManager';
import type { PlayerID } from './playersData';

export function initializePlayerData() {
  // Generate some initial random players
  for (let i = 0; i < 10; i++) {
    const id = `player-${i}` as PlayerID;
    const x = Math.random() * 10 - 5;
    const y = Math.random() * 10 - 5;
    const z = Math.random() * 10 - 5;
    const rotationX = Math.random() * Math.PI * 2;
    const rotationY = Math.random() * Math.PI * 2;
    const rotationZ = Math.random() * Math.PI * 2;
    const state = ['running', 'walking', 'jumping'][Math.floor(Math.random() * 3)];
    addOrUpdatePlayer(id, x, y, z, rotationX, rotationY, rotationZ, state);
  }
}

export function startP2PUpdates(callback: (id: PlayerID, x: number, y: number, z: number, rotationX: number, rotationY: number, rotationZ: number, state: 'running' | 'walking' | 'jumping') => void) {
  // Simulate P2P updates
  setInterval(() => {
    const id = `player-${Math.floor(Math.random() * 10)}` as PlayerID;
    const x = Math.random() * 10 - 5;
    const y = Math.random() * 10 - 5;
    const z = Math.random() * 10 - 5;
    const rotationX = Math.random() * Math.PI * 2;
    const rotationY = Math.random() * Math.PI * 2;
    const rotationZ = Math.random() * Math.PI * 2;
    const state = ['running', 'walking', 'jumping'][Math.floor(Math.random() * 3)];
    callback(id, x, y, z, rotationX, rotationY, rotationZ, state);
  }, 1000); // Update every second
}