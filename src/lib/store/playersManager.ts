import { PlayerData, players } from './playersData';
import type { PlayerID } from './playersData';

export function addOrUpdatePlayer(id: PlayerID, x: number, y: number, z: number, direction: number, state: 'running' | 'walking' | 'jumping'): void {
  const player = players.get(id);
  if (player) {
    player.updatePosition(x, y, z);
    player.updateDirection(direction);
    player.updateState(state);
  } else {
    players.set(id, new PlayerData(id, x, y, z, direction, state));
  }
}

export function removePlayer(id: PlayerID): void {
  players.delete(id);
}

export function handlePlayerUpdate(id: PlayerID, x: number, y: number, z: number, direction: number, state: 'running' | 'walking' | 'jumping'): void {
  addOrUpdatePlayer(id, x, y, z, direction, state);
}
