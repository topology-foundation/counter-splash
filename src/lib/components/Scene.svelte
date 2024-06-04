<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { Environment } from '@threlte/extras'
  import { AutoColliders, CollisionGroups } from '@threlte/rapier'
  import { spring } from 'svelte/motion'
  import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three'
  import Player from './Player.svelte'
  import Ground from './map/Ground.svelte'
  import SplashWall from './map/SplashWall.svelte';
  import PaintPlatforms from './map/PaintPlatforms.svelte'
    import ObstacleObjects from './map/ObstacleObjects.svelte';
  let playerMesh: Mesh
  let positionHasBeenSet = false
  const smoothPlayerPosX = spring(0)
  const smoothPlayerPosZ = spring(0)
  const t3 = new Vector3()

  useTask(() => {
    if (!playerMesh) return
    playerMesh.getWorldPosition(t3)
    smoothPlayerPosX.set(t3.x, {
      hard: !positionHasBeenSet
    })
    smoothPlayerPosZ.set(t3.z, {
      hard: !positionHasBeenSet
    })
    if (!positionHasBeenSet) positionHasBeenSet = true
  })
</script>

<Environment
  path="/hdr/"
  files="shanghai_riverside_1k.hdr"
/>

<T.AmbientLight intensity={.6} />

<T.DirectionalLight
  castShadow
  position={[8, 1000, -3]}
  intensity={1}
/>

<T.PointLight
  position={[0, 10, 0]}
  intensity={1}
  distance={100}
/>

<T.GridHelper
  args={[50]}
  position.y={0.01}
/>

<CollisionGroups groups={[0, 15]}>
  <SplashWall />
  <PaintPlatforms />
  <ObstacleObjects />
  <Ground />
</CollisionGroups>

<CollisionGroups groups={[0]}>
  <Player
    position={[0, 57, -25]}
  />

</CollisionGroups>
