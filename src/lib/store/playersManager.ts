import { players, PlayerData } from "./playersData";
import type { Player, PlayerID } from "./playersData";

export function addOrUpdatePlayer(input: Player): void {
  const player = players.get(input.id);
  console.log("addOrUpdatePlayer", input, player);
  if (player) {
    player.updatePosition(input.position.x, input.position.y, input.position.z);
    player.updateRotation(input.rotation.x, input.rotation.y, input.rotation.z);
    player.updateState(input.state);
  } else {
    players.set(input.id, new PlayerData(input));
  }
}

export function removePlayer(id: PlayerID): void {
  players.delete(id);
}
