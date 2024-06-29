<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { T, useFrame } from "@threlte/core";
    import { PlayerData, players } from "$lib/store/playersData";
    import type { PlayerID } from "$lib/store/playersData";
    import { addOrUpdatePlayer, removePlayer } from "$lib/store/playersManager";
    import { initializePlayerData, startP2PUpdates } from "$lib/store/fakeP2P";
    import { Vector3, Euler, Group, type Object3DEventMap } from 'three';
    import Model from './3DGodotRobot.svelte'
    import { useGltfAnimations, useGltf } from '@threlte/extras'

    let playerArray: PlayerData[] = [];

    function updatePlayerState(model: any, state: 'running' | 'walking' | 'jumping'): void {
        // Do more stuff
    }
  
    async function updatePlayerModel(player: PlayerData) {

        //model.position.copy(player.position);
        //model.rotation.copy(player.rotation);
        //updatePlayerState(model, player.state);
    }
    function updatePlayerArray() {
        playerArray = Array.from(players.values());
    }
  
    useFrame(() => {
        players.forEach(player => updatePlayerModel(player));
        updatePlayerArray();
    });
  
    onMount(async () => {
        await initializePlayerData();
        startP2PUpdates((id, x, y, z, rotationX, rotationY, rotationZ, state) => {
            //addOrUpdatePlayer(id, x, y, z, rotationX, rotationY, rotationZ, state);
            //updatePlayerArray();
        }, 60); // 60Hz = 16.17
    });
  
    onDestroy(() => {
        players.clear();
    });
  </script>
  
  {#if playerArray}
  {#each playerArray as player (player.id)}
    <T.Group 
        position={[player.position.x, player.position.y, player.position.z]}
        rotation={[player.rotation.x, player.rotation.y, player.rotation.z]}
    >
      <Model action={'Run-loop'} {player}/>
      <T.Mesh>
        <T.SphereGeometry args={[0.5, 32, 32]} position={[0, 1, 0]} />
        <T.MeshBasicMaterial color={0x00ff00} />
      </T.Mesh>
    </T.Group>
  {/each}
{/if}