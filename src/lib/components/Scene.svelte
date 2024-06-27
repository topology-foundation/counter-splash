<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { Environment } from '@threlte/extras'
  import { CollisionGroups } from '@threlte/rapier'
  import { spring } from 'svelte/motion'
  import { Mesh, Vector3 } from 'three'
  import Player from './Player.svelte'
  import PlayersRendering from './PlayersRendering.svelte'
  import SplashWall from './map/SplashWall.svelte';
  import ObstacleObjects from './map/ObstacleObjects.svelte';
  import GenericPlaform from './map/GenericPlatform.svelte';
  import ObstaclePlatforms from './map/ObstaclePlatforms.svelte';

  import { isIntersect } from '$lib/store/player'
  import { interactivity } from '@threlte/extras'
  import Level1Walls from './map/Level1/Level1Walls.svelte';
  import JumpPad from './map/JumpPad.svelte';
  import Level1 from './map/Level1/Level1.svelte';
  import { Group } from 'lucide-svelte';

  interactivity()

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


  function onHover (): void {
    isIntersect.set(true)
    }

  function offHover (): void {
    isIntersect.set(false)
      
  }
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
    <T.Group
      on:pointerover={onHover}
      on:pointerout={offHover}
    >
      
      <JumpPad position={[0, -7, 33]} />      
      <GenericPlaform position={[0, -7, 25]} />
      <!-- Lowest level, easy platforms-->
      <Level1 />
      <!-- Elevator, a section towards the back that enables vertical movement between the various levels more easily-->
      <ObstacleObjects seed={3221} center={[0, 35, 80]} containerHeight={50} containerWidth={80} containerLength={40} minSize={5} maxSize={7} numShapes={100} />
      <ObstacleObjects seed={3221} center={[0, 10, 53]} containerHeight={15} containerWidth={20} containerLength={40} minSize={5} maxSize={7} numShapes={12} />
      <ObstacleObjects seed={3231} center={[-80, 35, 40]} containerHeight={70} containerWidth={60} containerLength={100} minSize={5} maxSize={7} numShapes={100} />
      <ObstacleObjects seed={3241} center={[80, 35, 40]} containerHeight={70} containerWidth={60} containerLength={100} minSize={5} maxSize={7} numShapes={100} />
    </T.Group>
</CollisionGroups>

<PlayersRendering />

<!--55 is top-->
<CollisionGroups groups={[0]}>
  <Player
    position={[0, -3, 25]}
  />

</CollisionGroups>
