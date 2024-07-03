<script lang="ts">
  import { onMount } from "svelte";
  import { playerPosition } from "$lib/store/player";
  import type { Player } from "$lib/store/playersData";
  import { Vector3, Euler } from "three";

  let previousPosition: Player;
  const movementThreshold = 0.01;

  onMount(() => {
    const unsubscribe = playerPosition.subscribe((position: Player) => {
      if (!previousPosition) {
        previousPosition = position;
        return;
      }
      if (!coordinatesEqual(previousPosition.position, position.position)) {
        if (hasSignificantMovement(previousPosition.position, position.position)) {
          onPlayerMove(position.position);
        }
      }
      if (!rotationEqual(previousPosition.rotation, position.rotation)) {
        onCameraMove(position.rotation);
      }
      previousPosition = position;
    });
    return () => {
      unsubscribe();
    };
  });

  function coordinatesEqual(pos1: Vector3, pos2: Vector3): boolean {
    return pos1.x === pos2.x && pos1.y === pos2.y && pos1.z === pos2.z;
  }

  function rotationEqual(rot1: Euler, rot2: Euler): boolean {
    return rot1.x === rot2.x && rot1.y === rot2.y && rot1.z === rot2.z;
  }

  function hasSignificantMovement(pos1: Vector3, pos2: Vector3): boolean {
    const distance = pos1.distanceTo(pos2);
    return distance > movementThreshold;
  }

  function onPlayerMove(newPosition: Vector3) {
    console.log('Executing function due to player move.');
  }

  function onCameraMove(newRotation: Euler) {
    console.log('Executing function due to camera move.');
  }
</script>
