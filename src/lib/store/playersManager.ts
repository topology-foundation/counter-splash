import { players, PlayerData } from './playersData';
import type { PlayerID } from './playersData';

export function addOrUpdatePlayer(
  id: PlayerID,
  x: number,
  y: number,
  z: number,
  rotationX: number,
  rotationY: number,
  rotationZ: number,
  state: 'running' | 'walking' | 'jumping'
): void {
  const player = players.get(id);
  if (player) {
    player.updatePosition(x, y, z);
    player.updateRotation(rotationX, rotationY, rotationZ);
    player.updateState(state);
  } else {
    players.set(id, new PlayerData(id, x, y, z, rotationX, rotationY, rotationZ, state));
  }
}

export function removePlayer(id: PlayerID): void {
  players.delete(id);
}
