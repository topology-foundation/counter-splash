<script lang="ts">
  import Ui from './UI/Ui.svelte';
  import { Canvas } from '@threlte/core'
  import { World } from '@threlte/rapier'
  import Scene from './Scene.svelte'
</script>

<Ui />
<div class="relative h-full w-full">
  <Canvas>
    <World>
      <Scene />
    </World>
  </Canvas>
</div>
