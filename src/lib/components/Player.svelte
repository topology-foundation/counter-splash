<script lang="ts">
    import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat'
    import { T, useTask, useThrelte } from '@threlte/core'
    import { RigidBody, CollisionGroups, Collider } from '@threlte/rapier'
    import { onMount } from 'svelte'
    import { PerspectiveCamera, Vector3, Raycaster, Vector2, CircleGeometry, MeshBasicMaterial, Mesh } from 'three'
    import PointerLockControls from './PointerLockControls.svelte'
    import { selectedKeyboard } from '$lib/store/settings'
    import { paintMode, isMouseDown, mousePosition, isIntersect, color } from '$lib/store/player'
    import { get } from 'svelte/store'
    import { updatePixels } from '$lib/store/wall';
    import { setCanPaint } from '$lib/store/player';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    export let position: [x: number, y: number, z: number] = [0, 0, 0]
    let radius = 0.3
    let height = 1.7
    export let speed = 6
    let jumpForce = 10;

    let rigidBody: RapierRigidBody
    let lock: () => void
    let cam: PerspectiveCamera
  
    let forward = 0
    let backward = 0
    let left = 0
    let right = 0
    let jump = false;

    let dot: Mesh;

    const t = new Vector3()
  
    const lockControls = () => lock()
  
    const { renderer, scene } = useThrelte()

    const raycaster = new Raycaster()
    let touchingGround = false

    const zoomLevel = tweened(1, { duration: 500, easing: cubicOut });

    $: zoomLevel.subscribe(value => {
        if (cam) {
            cam.zoom = value;
            cam.updateProjectionMatrix();
        }
    });

    onMount(() => {
      // Create a circle geometry
      const dotGeometry = new CircleGeometry(0.01, 32); // Adjust the radius and segments as needed

      // Create a material
      const dotMaterial = new MeshBasicMaterial({ color: 0xffffff });

      // Create a mesh using this geometry and material
      dot = new Mesh(dotGeometry, dotMaterial);

      // Position the dot in the center of the camera
      dot.position.set(0, 0, -0.5);

      // Add the dot to the camera
      cam.add(dot);
    });


    useTask(() => {
      if (!rigidBody) return
      // get direction
      const velVec = t.fromArray([right - left, 0, backward - forward])
      // sort rotate and multiply by speed
      velVec.applyEuler(cam.rotation).multiplyScalar(speed)  
      // don't override falling velocity
      const linVel = rigidBody.linvel()
      t.y = linVel.y      
      // when body position changes update position prop for camera
      const pos = rigidBody.translation()
      position = [pos.x, pos.y, pos.z]


      // Turn raycaster downwards to check for ground intersections
      raycaster.set(new Vector3(pos.x, pos.y, pos.z), new Vector3(0, -1, 0))

      const intersects = raycaster.intersectObject(scene, true)
      
      // START Jump Logic
      const intersectsWithJumpPad = intersects.find(intersect => intersect.object.name === "jumpPad");
      
      if (jump && touchingGround) {
        t.y = jumpForce;
        jump = false;
      }    

      // *groundingTolerance* Allows a player to jump even if there is a slight amount of distance between player and ground
      // This extra distance happens whern a player is floaty and walking down a slope
      const groundingTolerance = 0.5
    
      if (intersectsWithJumpPad && intersectsWithJumpPad?.distance < height / 2 + groundingTolerance) {
        t.y = jump ? 22 :  15;
        jump = false;        
        console.log(intersectsWithJumpPad?.distance,  height)
      }
      
      // finally set the velocities and wake up the body
      rigidBody.setLinvel(t, true)
      
      // END Jump Logic

      if (intersects.length > 0 && intersects[0].distance < height / 2 + groundingTolerance) {
        touchingGround = true
      } else {
        touchingGround = false
      }

      if(t.y < -50) {
        rigidBody.setTranslation(new Vector3(0, 35, 50), true)
        rigidBody.setLinvel(new Vector3(0, -5, 0), true)
        cam.rotation.set(0, 0, 0)
      }

    })

    

    const keyMapping: { [x: string]: any; qwerty?: { forward: string; backward: string; left: string; right: string; jump: string }; azerty?: { forward: string; backward: string; left: string; right: string; jump: string }; } = {
      qwerty: {
        forward: 'w',
        backward: 's',
        left: 'a',
        right: 'd',
        jump: ' '
      },
      azerty: {
        forward: 'z',
        backward: 's',
        left: 'q',
        right: 'd',
        jump: ' '
      },
      // Add other keyboard layouts here
    }
  
    function onKeyDown(e: KeyboardEvent) {
      const mapping = keyMapping[$selectedKeyboard];
      switch (e.key) {
        case mapping.backward:
        case 'ArrowDown':
          backward = 1;
          break;
        case mapping.forward:
        case 'ArrowUp':
          forward = 1;
          break;
        case mapping.left:
        case 'ArrowLeft':
          left = 1;
          break;
        case mapping.right:
        case 'ArrowRight':
          right = 1;
          break;
        case mapping.jump:
          if (e.key === mapping.jump || e.key === ' ') {
            jump = true;
          }
          break;
        default:
          break;
      }
    }
  
    function onKeyUp(e: KeyboardEvent) {
      const mapping = keyMapping[$selectedKeyboard];
      switch (e.key) {
        case mapping.backward:
        case 'ArrowDown':
          backward = 0;
          break;
        case mapping.forward:
        case 'ArrowUp':
          forward = 0;
          break;
        case mapping.left:
        case 'ArrowLeft':
          left = 0;
          break;
        case mapping.right:
        case 'ArrowRight':
          right = 0;
          break;
        case mapping.jump:
          if (e.key === mapping.jump || e.key === ' ') {
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

    let lastMousePosition: { x: number; y: number } | null = null;

    $: if ($isMouseDown && $paintMode && !$isIntersect) {
        // Convert the UV coordinates to pixel coordinates
        const x = Math.floor($mousePosition.x * 4000);
        const y = Math.floor($mousePosition.y * 3000);

        if (lastMousePosition) {
            const lastX = Math.floor(lastMousePosition.x * 4000);
            const lastY = Math.floor(lastMousePosition.y * 3000);
            drawLine(lastX, lastY, x, y);
        }

        lastMousePosition = { x: $mousePosition.x, y: $mousePosition.y };
    }

    function drawLine(x0: number, y0: number, x1: number, y1: number): void {
        const updates: { x: number; y: number; r: number; g: number; b: number; a: number }[] = [];
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = (x0 < x1) ? 1 : -1;
        const sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;

        while (true) {
            drawCircle(updates, x0, y0);

            if (x0 === x1 && y0 === y1) break;
            const e2 = err * 2;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
        updatePixels(updates);
    }
    function drawCircle(updates: { x: number; y: number; r: number; g: number; b: number; a: number }[], x: number, y: number): void {
        const { r, g, b, a } = get(color);
        for (let i = -10; i < 10; i++) {
            for (let j = -10; j < 10; j++) {
                if (i * i + j * j < 100) {
                    updates.push({ x: x + i, y: y + j, r, g, b, a });
                }
            }
        }
    }
    $: if (!$isMouseDown) {
        lastMousePosition = null;
    }
      

  </script>
  
  <svelte:window
    on:keydown|preventDefault={onKeyDown}
    on:keyup={onKeyUp}
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
        ref.lookAt(new Vector3(0, 2, 0))
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
          shape={'capsule'}
          args={[height / 2 - radius, radius]}
          friction={0}
          restitution={0}
        />
      </CollisionGroups>
  
      <CollisionGroups groups={[15]}>
        <T.Group position={[0, -height / 2 + radius, 0]}>
          <Collider
            sensor
            shape={'ball'}
            args={[radius * 1.2]}
            restitution={0}
          />
        </T.Group>
      </CollisionGroups>
    </RigidBody>
  </T.Group>
  