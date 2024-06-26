<!--
  PaintPlatforms generates platforms near the wall for players to paint on
-->

<script lang="ts">
    import { T } from '@threlte/core'
    import { AutoColliders } from '@threlte/rapier'
  
    export let width = 10; // adjust as needed
    export let height = 5;
    const depth = 20;
    export let position = [0, 0, 0];
    export let rotation = [0, 0, 50];

  </script>
  
  
<AutoColliders shape={'cuboid'} friction={0}>
    <T.Mesh name={`Wall${height}${position}`} position={position}  rotation={rotation} >
    <T.BoxGeometry args={[width, height, .5]} />
    <T.MeshStandardMaterial transparent opacity={0.5} />
    </T.Mesh>
</AutoColliders>        
  