<script lang="ts">
  import type { RigidBody as RapierRigidBody } from "@dimforge/rapier3d-compat";
  import { T, useTask, useThrelte } from "@threlte/core";
  import { RigidBody, CollisionGroups, Collider } from "@threlte/rapier";
  import {
    PerspectiveCamera,
    Vector3,
    Vector2,
    Raycaster,
    CircleGeometry,
    MeshBasicMaterial,
    Mesh,
  } from "three";
  import PointerLockControls from "./PointerLockControls.svelte";
  import { paintMode } from "$lib/store/player";
  import {
    setPlayerPosition,
    playerPosition,
    addSprayData,
    selectedSpray,
  } from "$lib/store/player";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { onMount } from "svelte";
  import { handlePainting } from "./player/paintLogic";
  import { createEventHandlers } from "./player/eventHandler";
  import { get } from "svelte/store";
  import { width, height } from "$lib/store/wall";

  export let position: [x: number, y: number, z: number] = [0, 0, 0];
  let maxSprayDistance = 20;
  let radius = 0.3;
  let h = 1.7;

  // parameters that control the pace of movement
  export let speed = 9;
  const jumpForce = 25;
  const gravityScale = 7;
  const dashFrameCountMax = 3;
  const dashSpeedMultiplier = 6;

  let rigidBody: RapierRigidBody;
  let lock: () => void;
  let cam: PerspectiveCamera;

  let dot: Mesh;

  const t = new Vector3();
  const { scene } = useThrelte();
  const raycaster = new Raycaster();

  // some stats
  let touchingGround = false;
  let dashCharged = true;
  let dashFrameCount = dashFrameCountMax;

  const coyoteFrames = 30;
  let coyoteFrameCount = coyoteFrames;
  let coyoteCountingDown = false;
  const zoomLevel = tweened(1, { duration: 500, easing: cubicOut });

  const { onKeyDown, onKeyUp, getControls } = createEventHandlers();

  let intervalId: any;

  onMount(() => {
    const dotGeometry = new CircleGeometry(0.01, 32);
    const dotMaterial = new MeshBasicMaterial({ color: 0xffffff });
    dot = new Mesh(dotGeometry, dotMaterial);
    dot.position.set(0, 0, -0.5);
    cam.add(dot);
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
    const { forward, backward, left, right, jump, dash } = getControls();
    handleMovement(forward, backward, left, right, jump, dash);
    handleGrounding();
    handleOutOfBounds();
    const currentPlayerPosition = get(playerPosition);
    setPlayerPosition(
      new Vector3(...position),
      cam.rotation.clone(),
      currentPlayerPosition.state,
    );
    handleCursor();
  });

  function handleMovement(
    forward: number,
    backward: number,
    left: number,
    right: number,
    jump: boolean,
    dash: boolean,
  ) {
    console.log('handleMovement: jump',jump,' dash',dash);
    const velVec = t.set(right - left, 0, backward - forward);
    velVec.applyEuler(cam.rotation).multiplyScalar(speed);
    const linVel = rigidBody.linvel();
    t.y = linVel.y;

    const pos = rigidBody.translation();
    position = [pos.x, pos.y, pos.z];

    if (touchingGround) {
      dashCharged = true;
      dash = false;
      dashFrameCount = dashFrameCountMax;
    }
    else {
      // in the air

      if (!dashCharged){
        if (dashFrameCount>0){
          // air-dashing => decrement dashFrameCount, retain velocity
          t.x = linVel.x;
          t.y = linVel.y;
          t.z = linVel.z;
          dashFrameCount -= 1;
        }
        else {
          // air-dash depleted => set x & z velocity to 0, retain vertical velocity
          t.x = 0;
          t.y = linVel.y;
          t.z = 0;
        }
      }
      else {
        // in the middle of a jump => retain velocity
        t.x = linVel.x;
        t.y = linVel.y;
        t.z = linVel.z;
      }
    }

    // activate jump
    if (jump && touchingGround) {
      t.y = jumpForce;
      jump = false;
    }

    // activate air-dash
    if (dash && !touchingGround && dashCharged) {
      // compute air-dash velocity vector
      const dashVelVec = t.set(0, 0, -1); // dashing forward
      dashVelVec.applyEuler(cam.rotation).multiplyScalar(speed * dashSpeedMultiplier);

      // add existing velocity
      const linVel = rigidBody.linvel();
      t.x += linVel.x;
      t.y += linVel.y;
      t.z += linVel.z;

      // housekeeping
      dash = false;
      dashCharged = false;
    }

    rigidBody.setLinvel(t, true);
  }

  function handleGrounding() {
    const pos = rigidBody.translation();

    // Scenario 1: being vertically (y-axis) close to the ground is considered grounded
    // this helps enable bunny hops
    raycaster.set(new Vector3(pos.x, pos.y, pos.z), new Vector3(0, -1, 0));
    const intersects = raycaster.intersectObject(scene, true);
    const bhopGrounded =
      intersects.length > 0 && intersects[0].distance < h / 2 + 0.5;

    // Scenario 2: coyote time
    // https://en.wiktionary.org/wiki/coyote_time
    let coyoteGrounded = false;
    if (touchingGround && !bhopGrounded) {
      // We are at the frame where we are bhopGrounded, but the next frame we won't be,
      // meaning we are about to leave a platform e.g. walking off a ledge
      coyoteGrounded = true;
      coyoteCountingDown = true;
    }
    if (coyoteCountingDown) {
      coyoteFrameCount -= 1;
      if (coyoteFrameCount == 0) {
        coyoteCountingDown = false; // stop counting down
        coyoteFrameCount = coyoteFrames; // reset
        coyoteGrounded = false; // coyote time has passed
      }
    }

    // Aggregate scenario 1 & 2
    touchingGround = bhopGrounded || coyoteGrounded;
  }

  function handleOutOfBounds() {
    if (t.y < -50) {
      rigidBody.setTranslation(new Vector3(0, -3, 25), true);
      rigidBody.setLinvel(new Vector3(0, -5, 0), true);
      cam.rotation.set(0, 0, 0);
    }
  }
  let lastSprayTime = 0;

  function handleCursor() {
    const now = Date.now();
    if (now - lastSprayTime < 3000) {
      if (dot.material instanceof MeshBasicMaterial) {
        dot.material.color.set(0xffffff);
      }
      return;
    }
    raycaster.setFromCamera(new Vector2(0, 0), cam);
    const wallIntersects = raycaster.intersectObjects(scene.children, true);
    const intersectsWithSplashWall = wallIntersects.find(
      (intersect) => intersect.object.name === "SplashWall",
    );
    if (intersectsWithSplashWall && dot.material instanceof MeshBasicMaterial) {
      const distance = intersectsWithSplashWall.distance;
      if (distance <= maxSprayDistance) {
        dot.material.color.set(0xff0000);
      } else {
        dot.material.color.set(0xffffff);
      }
    }
  }

  function handleSpray() {
    const now = Date.now();
    if (now - lastSprayTime < 3000) {
      return;
    }
    lastSprayTime = now;

    raycaster.setFromCamera(new Vector2(0, 0), cam);
    const wallIntersects = raycaster.intersectObjects(scene.children, true);
    const intersectsWithSplashWall = wallIntersects.find(
      (intersect) => intersect.object.name === "SplashWall",
    );

    if (intersectsWithSplashWall && dot.material instanceof MeshBasicMaterial) {
      const distance = intersectsWithSplashWall.distance;

      if (distance <= maxSprayDistance) {
        const uv = intersectsWithSplashWall.uv;
        if (uv) {
          const sprayData = {
            id: $selectedSpray,
            offset: { x: uv.x * width, y: uv.y * height },
            timestamp: Math.floor(Date.now() / 1000),
          };
          addSprayData(sprayData);
        }
      }
    }
  }

  // // Paint mode handler
  // $: {
  //   if ($paintMode && cam) {
  //     let coord = cam.position;
  //     const distanceFromWall = Math.abs(coord.z + 50);
  //     zoomLevel.set(distanceFromWall / 10);
  //   } else if (!$paintMode && cam) {
  //     zoomLevel.set(1);
  //   }
  // }
</script>

<svelte:window
  on:keydown|preventDefault={onKeyDown}
  on:keyup={onKeyUp}
  on:click={handleSpray}
/>

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
    gravityScale={gravityScale}
  >
    <CollisionGroups groups={[0]}>
      <Collider
        shape={"capsule"}
        args={[h / 2 - radius, radius]}
        friction={0}
        restitution={0}
      />
    </CollisionGroups>

    <CollisionGroups groups={[15]}>
      <T.Group position={[0, -h / 2 + radius, 0]}>
        <Collider sensor shape={"ball"} args={[radius * 1.2]} restitution={0} />
      </T.Group>
    </CollisionGroups>
  </RigidBody>
</T.Group>
