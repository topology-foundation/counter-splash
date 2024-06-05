<script lang="ts">
    import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat'
    import { T, useTask, useThrelte } from '@threlte/core'
    import { RigidBody, CollisionGroups, Collider } from '@threlte/rapier'
    import { onMount } from 'svelte'
    import { PerspectiveCamera, Vector3, Raycaster, Vector2, CircleGeometry, MeshBasicMaterial, Mesh } from 'three'
    import PointerLockControls from './PointerLockControls.svelte'
    import { selectedKeyboard, paintMode } from '$lib/store/settings'
    import { updatePixels } from '$lib/store/wall';
    import { setCanPaint } from '$lib/store/player';

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
    let isMouseDown = 0;
    let jump = false;

    let dot: Mesh;

    const t = new Vector3()
  
    const lockControls = () => lock()
  
  const { renderer, scene } = useThrelte()
  

    const raycaster = new Raycaster()
    let touchingGround = false
    
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
      if (jump && touchingGround) {
        t.y = jumpForce;
        jump = false;
      }

      // finally set the velocities and wake up the body
      rigidBody.setLinvel(t, true)
  
      // when body position changes update position prop for camera
      const pos = rigidBody.translation()
      position = [pos.x, pos.y, pos.z]

      raycaster.set(new Vector3(pos.x, pos.y, pos.z), new Vector3(0, -1, 0))

      const intersects = raycaster.intersectObject(scene, true)
      
      // Allows a player to jump even if there is a slight amount of distance between player and ground
      // This extra distance happens whern a player is floaty and walking down a slope
      const groundingTolerance = 0.5
      if (intersects.length > 0 && intersects[0].distance < height / 2 + groundingTolerance) {
        touchingGround = true
      } else {
        touchingGround = false
      }
      // Check for intersections with the wall
      raycaster.setFromCamera(new Vector2(0, 0), cam);
      const wallIntersects = raycaster.intersectObjects(scene.children, true);

      const intersectsWithSplashWall = wallIntersects.find(intersect => intersect.object.name === "SplashWall");
      const distance = intersectsWithSplashWall?.distance || 1000;
      if (intersectsWithSplashWall && distance < 10 && dot.material instanceof MeshBasicMaterial) {
        dot.material.color.set(0xff0000);
        setCanPaint(true);
      // Get the UV coordinates of the intersection point
      const uv = intersectsWithSplashWall.uv;      
      if(isMouseDown && uv) {
        // Convert the UV coordinates to pixel coordinates
        const x = Math.floor(uv?.x * 4000);
        const y = Math.floor(uv?.y * 3000);        
        // Draw pixels in a circle with radius 10 around the intersection 
        const updates = [];
        for (let i = -10; i < 10; i++) {
          for (let j = -10; j < 10; j++) {
            if (i * i + j * j < 100) {
              updates.push({ x: x + i, y: y + j, r: 255, g: 0, b: 0, a: 255 })       
            }
          }
        }        
        updatePixels(updates);
      }
      
      
      } else if(dot.material instanceof MeshBasicMaterial) {
        dot.material.color.set(0xffffff);
        setCanPaint(false);
      }
      
      if(t.y < -50) {
        rigidBody.setTranslation(new Vector3(0, 5, 0), true)
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
      if ($paintMode) return;
      const mapping = keyMapping[$selectedKeyboard];
      switch (e.key) {
        case mapping.backward:
          backward = 1;
          break;
        case mapping.forward:
          forward = 1;
          break;
        case mapping.left:
          left = 1;
          break;
        case mapping.right:
          right = 1;
          break;
        case mapping.jump:
          jump = true;
          break;
        default:
          break;
      }
    }
  
    function onKeyUp(e: KeyboardEvent) {
      const mapping = keyMapping[$selectedKeyboard]; 
      switch (e.key) {
        case mapping.backward:
          backward = 0;
          break;
        case mapping.forward:
          forward = 0;
          break;
        case mapping.left:
          left = 0;
          break;
        case mapping.right:
          right = 0;
          break;
        case mapping.jump:
          jump = false;
          break;
        default:
          break;
      }
    }

    function onMouseDown() {
      isMouseDown = 1;
    }

    function onMouseUp() {
      isMouseDown = 0;
    }
  
  </script>
  
  <svelte:window
    on:keydown|preventDefault={onKeyDown}
    on:keyup={onKeyUp}
    on:mousedown={onMouseDown} 
    on:mouseup={onMouseUp}
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
  