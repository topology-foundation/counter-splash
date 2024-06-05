<script lang="ts">
    import { T } from '@threlte/core'
    import { AutoColliders } from '@threlte/rapier'
  </script>
  
  <T.Group position={[0, 30, 50]}>
    <AutoColliders shape={'cuboid'}>
      <T.Mesh receiveShadow>
        <T.BoxGeometry args={[5, 1, 5]} />
        <T.MeshStandardMaterial />
      </T.Mesh>
    </AutoColliders>
  </T.Group>
  