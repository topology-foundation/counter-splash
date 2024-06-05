<script lang="ts">
    import { T } from '@threlte/core'
    import { AutoColliders } from '@threlte/rapier'

    export let position: [number, number, number] = [0, 0, 0]
    export let size: [number, number, number] = [5, 1, 5]
  </script>
  
  <T.Group position={position}>
    <AutoColliders shape={'cuboid'}>
      <T.Mesh receiveShadow>
        <T.BoxGeometry args={size} />
        <T.MeshStandardMaterial />
      </T.Mesh>
    </AutoColliders>
  </T.Group>
  