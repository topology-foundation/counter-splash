<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { T, useFrame } from "@threlte/core";
  import { PlayerData, players } from "$lib/store/playersData";
  import type { PlayerID } from "$lib/store/playersData";
  import { addOrUpdatePlayer, removePlayer } from "$lib/store/playersManager";
  import { initializePlayerData, startP2PUpdates } from "$lib/store/fakeP2P";
  import { Vector3, Euler } from "three";
  import Player from "./Player.svelte";
  import { nodeId } from "$lib/topology";

  let playerModels: Map<PlayerID, any> = new Map();
  let playerArray: PlayerData[] = [];

  function createPlayerModel() {
    return {
      position: new Vector3(),
      rotation: new Euler(),
    };
  }

  function updatePlayerState(
    model: any,
    state: "idle" | "running" | "walking" | "jumping",
  ): void {
    // Do more stuff
  }

  function updatePlayerModel(player: PlayerData) {
    // Find or create the 3D model for the player
    let model = playerModels.get(player.id);
    if (!model) {
      model = createPlayerModel();
      playerModels.set(player.id, model);
    }

    model.position.copy(player.position);
    model.rotation.copy(player.rotation);
    updatePlayerState(model, player.state);
  }

  function updatePlayerArray() {
    playerArray = Array.from(players.values());
  }

  useFrame(() => {
    players.forEach((player) => updatePlayerModel(player));
    updatePlayerArray();
  });

  onMount(async () => {
    // //Sets up the mock data of the users
    // await initializePlayerData();
    // startP2PUpdates((id, x, y, z, rotationX, rotationY, rotationZ, state) => {
    //     addOrUpdatePlayer(id, x, y, z, rotationX, rotationY, rotationZ, state);
    //     updatePlayerArray();
    // }, 60); // 60Hz = 16.17
  });

  onDestroy(() => {
    players.clear();
  });

  function stringToColor(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return parseInt("0x" + "00000".substring(0, 6 - c.length) + c);
  }
</script>

{#if playerArray}
  {#each playerArray as player (player.id)}
  <T.Group
  >
  <T.Mesh
  position={[player.position.x, player.position.y+0.5, player.position.z]}
  >
    <T.SphereGeometry args={[0.5, 32, 32]} position={[0, 1, 0]} />
    <T.MeshBasicMaterial color={stringToColor(player.id)} />
  </T.Mesh>
  <T.Mesh
  position={[player.position.x, player.position.y-0.055, player.position.z]}
  >
    <T.ConeGeometry args={[0.5, 1.5]} position={[0, 0, 0]} />
    <T.MeshBasicMaterial color={stringToColor(player.id)} />

  </T.Mesh>
  </T.Group>
  {/each}
{/if}
