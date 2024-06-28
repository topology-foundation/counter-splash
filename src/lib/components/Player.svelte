<script lang="ts">
  import type { RigidBody as RapierRigidBody } from "@dimforge/rapier3d-compat";
  import { T, useTask, useThrelte } from "@threlte/core";
  import { RigidBody, CollisionGroups, Collider } from "@threlte/rapier";
  import {
    PerspectiveCamera,
    Vector3,
    Raycaster,
    Mesh,
  } from "three";
  import PointerLockControls from "./PointerLockControls.svelte";
  import { selectedKeyboard, keyMapping } from "$lib/store/settings";
  import { paintMode, debugMode } from "$lib/store/player";
  import { setPlayerPosition, setDebugMode } from "$lib/store/player";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import Paint from "./player/Paint.svelte";

  export let position: [x: number, y: number, z: number] = [0, 0, 0];
  let radius = 0.3;
  let height = 1.7;
  export let speed = 6;
  let jumpForce = 10;

  let rigidBody: RapierRigidBody;
  let lock: () => void;
  let cam: PerspectiveCamera;

  let forward = 0;
  let backward = 0;
  let left = 0;
  let right = 0;
  let jump = false;

  const t = new Vector3();
  const { scene } = useThrelte();
  const raycaster = new Raycaster();
  let touchingGround = false;
  const zoomLevel = tweened(1, { duration: 500, easing: cubicOut });

  $: zoomLevel.subscribe((value) => {
    if (cam) {
      cam.zoom = value;
      cam.updateProjectionMatrix();
    }
  });

  useTask(() => {
    if (!rigidBody) return;
    handleMovement();
    handleGrounding();
    handleOutOfBounds();
    setPlayerPosition(position);
  });

  function handleMovement() {
    const velVec = t.set(right - left, 0, backward - forward);
    velVec.applyEuler(cam.rotation).multiplyScalar(speed);
    const linVel = rigidBody.linvel();
    t.y = linVel.y;
    const pos = rigidBody.translation();
    position = [pos.x, pos.y, pos.z];
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

  function onKeyDown(e: KeyboardEvent) {
    const mapping = keyMapping[$selectedKeyboard];
    switch (e.key) {
      case mapping.backward:
      case "ArrowDown":
        backward = 1;
        break;
      case mapping.forward:
      case "ArrowUp":
        forward = 1;
        break;
      case mapping.left:
      case "ArrowLeft":
        left = 1;
        break;
      case mapping.right:
      case "ArrowRight":
        right = 1;
        break;
      case mapping.jump:
        if (e.key === mapping.jump || e.key === " ") {
          jump = true;
        }
        break;
      case mapping.debug:
        setDebugMode(!$debugMode);
        break;
      default:
        break;
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    const mapping = keyMapping[$selectedKeyboard];

    switch (e.key) {
      case mapping.backward:
      case "ArrowDown":
        backward = 0;
        break;
      case mapping.forward:
      case "ArrowUp":
        forward = 0;
        break;
      case mapping.left:
      case "ArrowLeft":
        left = 0;
        break;
      case mapping.right:
      case "ArrowRight":
        right = 0;
        break;
      case mapping.jump:
        if (e.key === mapping.jump || e.key === " ") {
          jump = false;
        }
        break;
      default:
        break;
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

<Paint />

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
