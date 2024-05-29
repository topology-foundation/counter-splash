<script lang="ts">
    import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat'
    import { T, useTask, useThrelte } from '@threlte/core'
    import { RigidBody, CollisionGroups, Collider } from '@threlte/rapier'
    import { onDestroy } from 'svelte'
    import { PerspectiveCamera, Vector3 } from 'three'
    import PointerLockControls from './PointerLockControls.svelte'
    import { selectedKeyboard } from '$lib/store'
  
    export let position: [x: number, y: number, z: number] = [0, 0, 0]
    let radius = 0.3
    let height = 1.7
    export let speed = 6
  
    let rigidBody: RapierRigidBody
    let lock: () => void
    let cam: PerspectiveCamera
  
    let forward = 0
    let backward = 0
    let left = 0
    let right = 0
  
    const t = new Vector3()
  
    const lockControls = () => lock()
  
    const { renderer } = useThrelte()
  
    renderer.domElement.addEventListener('click', lockControls)
  
    onDestroy(() => {
      renderer.domElement.removeEventListener('click', lockControls)
    })
  
    useTask(() => {
      if (!rigidBody) return
      // get direction
      const velVec = t.fromArray([right - left, 0, backward - forward])
      // sort rotate and multiply by speed
      velVec.applyEuler(cam.rotation).multiplyScalar(speed)
      // don't override falling velocity
      const linVel = rigidBody.linvel()
      t.y = linVel.y
      // finally set the velocities and wake up the body
      rigidBody.setLinvel(t, true)
  
      // when body position changes update position prop for camera
      const pos = rigidBody.translation()
      position = [pos.x, pos.y, pos.z]
    })


    const keyMapping: { [x: string]: any; qwerty?: { forward: string; backward: string; left: string; right: string; }; azerty?: { forward: string; backward: string; left: string; right: string; }; } = {
      qwerty: {
        forward: 'w',
        backward: 's',
        left: 'a',
        right: 'd'
      },
      azerty: {
        forward: 'z',
        backward: 's',
        left: 'q',
        right: 'd'
      },
      // Add other keyboard layouts here
    }
  
    function onKeyDown(e: KeyboardEvent) {
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
        default:
          break;
      }
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
      {position}
      enabledRotations={[false, false, false]}
    >
      <CollisionGroups groups={[0]}>
        <Collider
          shape={'capsule'}
          args={[height / 2 - radius, radius]}
        />
      </CollisionGroups>
  
      <CollisionGroups groups={[15]}>
        <T.Group position={[0, -height / 2 + radius, 0]}>
          <Collider
            sensor
            shape={'ball'}
            args={[radius * 1.2]}
          />
        </T.Group>
      </CollisionGroups>
    </RigidBody>
  </T.Group>
  