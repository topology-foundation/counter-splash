<script lang="ts">
  import type { RigidBody as RapierRigidBody } from "@dimforge/rapier3d-compat";
  import { T, useTask, useThrelte } from "@threlte/core";
  import { RigidBody, CollisionGroups, Collider } from "@threlte/rapier";
  import { PerspectiveCamera, Vector3, Raycaster } from "three";
  import PointerLockControls from "./PointerLockControls.svelte";
  import { paintMode } from "$lib/store/player";
  import { setPlayerPosition } from "$lib/store/player";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { onMount } from "svelte";
  import { handlePainting } from "./player/paintLogic";
  import { createEventHandlers } from "./player/eventHandler";

  export let position: [x: number, y: number, z: number] = [0, 0, 0];
  let radius = 0.3;
  let height = 1.7;
  export let speed = 6;
  let jumpForce = 10;

  let rigidBody: RapierRigidBody;
  let lock: () => void;
  let cam: PerspectiveCamera;

  const t = new Vector3();
  const { scene } = useThrelte();
  const raycaster = new Raycaster();
  let touchingGround = false;
  const zoomLevel = tweened(1, { duration: 500, easing: cubicOut });

  const { onKeyDown, onKeyUp, getControls } = createEventHandlers();

  let intervalId: any;

  onMount(() => {
    intervalId = setInterval(handlePainting, 16);
    return () => clearInterval(intervalId);
  });

  $: zoomLevel.subscribe((value) => {
    if (cam) {
      cam.zoom = value;
      cam.updateProjectionMatrix();
    }
  });

  useTask(() => {
    if (!rigidBody) return;
    const { forward, backward, left, right, jump } = getControls();
    handleMovement(forward, backward, left, right, jump);
    handleGrounding();
    handleOutOfBounds();
    setPlayerPosition(position);
  });

  function handleMovement(
    forward: number,
    backward: number,
    left: number,
    right: number,
    jump: boolean,
  ) {
    const velVec = t.set(right - left, 0, backward - forward);
    velVec.applyEuler(cam.rotation).multiplyScalar(speed);
    const linVel = rigidBody.linvel();
    t.y = linVel.y;
    const pos = rigidBody.translation();
    position = [pos.x, pos.y, pos.z];
    
    raycaster.set(new Vector3(pos.x, pos.y, pos.z), new Vector3(0, -1, 0));
    const intersects = raycaster.intersectObject(scene, true);
    const intersectsWithJumpPad = intersects.find(
      (intersect) => intersect.object.name === "jumpPad",
    );

    // *groundingTolerance* Allows a player to jump even if there is a slight amount of distance between player and ground
    // This extra distance happens whern a player is floaty and walking down a slope
    const groundingTolerance = 0.5;

    if (
      intersectsWithJumpPad &&
      intersectsWithJumpPad?.distance < height / 2 + groundingTolerance
    ) {
      t.y = jump ? 22 : 15;
      jump = false;
    }

    if (jump && touchingGround) {
      t.y = jumpForce;
      jump = false;
    }
    rigidBody.setLinvel(t, true);
  }

  function handleGrounding() {
    const pos = rigidBody.translation();
    raycaster.set(new Vector3(pos.x, pos.y, pos.z), new Vector3(0, -1, 0));
    const intersects = raycaster.intersectObject(scene, true);
    touchingGround =
      intersects.length > 0 && intersects[0].distance < height / 2 + 0.5;
  }

  function handleOutOfBounds() {
    if (t.y < -50) {
      rigidBody.setTranslation(new Vector3(0, -3, 25), true);
      rigidBody.setLinvel(new Vector3(0, -5, 0), true);
      cam.rotation.set(0, 0, 0);
    }
  }

  // Paint mode handler
  $: {
    if ($paintMode && cam) {
      let coord = cam.position;
      const distanceFromWall = Math.abs(coord.z + 50);
      zoomLevel.set(distanceFromWall / 10);
    } else if (!$paintMode && cam) {
      zoomLevel.set(1);
    }
  }
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} on:keyup={onKeyUp} />

<T.Group position.y={0.9}>
  <T.PerspectiveCamera
    makeDefault
    fov={90}
    bind:ref={cam}
    position.x={position[0]}
    position.y={position[1]}
    position.z={position[2]}
    on:create={({ ref }) => {
      ref.lookAt(new Vector3(0, 2, 0));
    }}
  >
    <PointerLockControls bind:lock />
  </T.PerspectiveCamera>
</T.Group>

<T.Group {position}>
  <RigidBody
    bind:rigidBody
    enabledRotations={[false, false, false]}
    gravityScale={1.5}
  >
    <CollisionGroups groups={[0]}>
      <Collider
        shape={"capsule"}
        args={[height / 2 - radius, radius]}
        friction={0}
        restitution={0}
      />
    </CollisionGroups>

    <CollisionGroups groups={[15]}>
      <T.Group position={[0, -height / 2 + radius, 0]}>
        <Collider sensor shape={"ball"} args={[radius * 1.2]} restitution={0} />
      </T.Group>
    </CollisionGroups>
  </RigidBody>
</T.Group>
