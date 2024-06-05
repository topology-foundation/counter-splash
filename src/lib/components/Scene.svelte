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
    import GenericPlaform from './map/GenericPlatform.svelte';
    import ObstaclePlatforms from './map/ObstaclePlatforms.svelte';
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

<CollisionGroups groups={[0, 15]}>
  <SplashWall />
  <PaintPlatforms />
  <GenericPlaform position={[0, 30, 50]} />
  <!--<ObstacleObjects containerHeight={100} containerWidth={100} containerLength={100} minSize={1} maxSize={9} />-->
  <!-- Level 3 : Sparse and small objects, various heights, upper stratosphere -->
  <ObstacleObjects seed={789} center={[0, 50, 30]} containerHeight={10} containerWidth={120} containerLength={110} minSize={2} maxSize={5} numShapes={100} />
  <!-- Level 2 : Less objects, various heights, dark forest -->
  <ObstacleObjects seed={567} center={[0, 30, 20]} containerHeight={10} containerWidth={100} containerLength={100} minSize={3} maxSize={7} numShapes={100} />
  <!-- Level 1 : Plenty of large objects and pads -->
  <ObstacleObjects center={[0, 10, 20]} containerHeight={10} containerWidth={100} containerLength={100} minSize={3} maxSize={7} numShapes={150} />
  <!-- Lowest level, easy platforms-->
  <ObstaclePlatforms />
  <!-- Elevator, a section towards the back that enables vertical movement between the various levels more easily-->
  <ObstacleObjects seed={3221} center={[0, 40, 70]} containerHeight={60} containerWidth={80} containerLength={40} minSize={5} maxSize={7} numShapes={100} />
</CollisionGroups>

<CollisionGroups groups={[0]}>
  <Player
    position={[0, 35, 50]}
  />

</CollisionGroups>
